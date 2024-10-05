import Stripe from 'stripe';
import {pb} from '@/lib/pocketbase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res){
    const {planId, userId} = req.body;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: planId,
                quantity: 1, 
            },
        ],
        mode: 'subscription',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
        customer_email: (await pb.collection('users').getOne(userId)).email
    });

    res.status(200).json({id: session.id});

}