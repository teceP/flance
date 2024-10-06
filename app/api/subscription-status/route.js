import { createBrowserClient } from "@/lib/pocketbase"; // Importiere den PocketBase-Client
const pb = createBrowserClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Hole userId aus der URL

  console.log("Received userId:", userId);

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
    });
  }

  try {
    // 1. Hole alle Abonnements des Benutzers aus PocketBase
    const subscriptions = await pb.collection("subscriptions").getFullList({
      filter: `user_id = "${userId}" && status = "active"`,
    });

    // 2. Hole das aktuelle Datum
    const currentDate = new Date();

    // 3. Überprüfe, ob ein aktives Abonnement vorhanden ist
    const activeSubscription = subscriptions.find((sub) => {
      const startDate = new Date(sub.start_date);
      const endDate = new Date(sub.end_date);
      return (
        sub.status === "active" &&
        currentDate >= startDate &&
        currentDate <= endDate
      );
    });

    // 4. Rückgabe des Ergebnisses
    if (activeSubscription) {
      return new Response(
        JSON.stringify({ active: true, subscription: activeSubscription }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ active: false }), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
