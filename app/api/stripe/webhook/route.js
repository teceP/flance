import Stripe from "stripe";
import { pb } from "@/lib/pocketbase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const payload = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "invoice.payment_succeeded") {
    const session = event.data.object;
    const customerId = session.customer;

    const user = await pb
      .collection("users")
      .getFirstListItem({ stripe_customer_id: customerId });
    const subscription = await pb.collection("subscriptions").create({
      user_id: user.id,
      plan_id: session.plan.id,
      provider: "stripe",
      status: "active",
      start_date: new Date(session.start_date * 1000),
      next_billing_date: new Date(session.next_billing_date * 1000),
      amount: session.amount / 100,
      interval: session.plan.interval,
    });
  }

  res.status(200).json({ received: true });
}
