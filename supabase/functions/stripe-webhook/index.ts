import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Supabase client with service role key
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  const body = new Uint8Array(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  let event;

  try {
    if (!sig) throw new Error("Missing Stripe signature");
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    // Read user_id and plan from metadata
    const userId = session.metadata?.user_id;
    const plan = session.metadata?.plan ?? "free";
    const email = session.customer_email ?? "";

    // Get subscription end date from Stripe (optional, more accurate)
    let subscriptionEnd: string | null = null;
    if (session.subscription) {
      try {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        subscriptionEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;
      } catch (err) {
        console.error("Failed to fetch subscription details:", err);
      }
    }

    if (userId) {
      const { error } = await supabase.from("subscriptions").upsert({
        user_id: userId,
        email,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        subscribed: true,
        subscription_tier: plan,
        subscription_end: subscriptionEnd,
      });

      if (error) {
        console.error("Supabase upsert error:", error);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
