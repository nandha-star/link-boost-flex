import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Verify payment function started");

    const { session_id } = await req.json();
    if (!session_id) throw new Error("Session ID required");

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Session retrieved:", session.id, "Status:", session.payment_status);

    // Use service role key to update purchase records
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (session.payment_status === "paid") {
      // Update purchase status to paid
      const { error: updateError } = await supabaseService
        .from("connection_purchases")
        .update({ status: "paid" })
        .eq("stripe_session_id", session_id);

      if (updateError) {
        console.error("Error updating purchase status:", updateError);
        throw updateError;
      }

      // Get the purchase details to update user's connections
      const { data: purchase, error: fetchError } = await supabaseService
        .from("connection_purchases")
        .select("user_id, connections_purchased")
        .eq("stripe_session_id", session_id)
        .single();

      if (fetchError || !purchase) {
        console.error("Error fetching purchase:", fetchError);
        throw new Error("Purchase not found");
      }

      // Update user's connection count
      const { error: profileError } = await supabaseService.rpc('increment_user_connections', {
        p_user_id: purchase.user_id,
        p_connections: purchase.connections_purchased
      });

      if (profileError) {
        console.error("Error updating user connections:", profileError);
        // Don't throw here - payment is still successful
      }

      console.log("Payment verified and connections updated successfully");
      
      return new Response(JSON.stringify({ 
        success: true, 
        status: "paid",
        connections_added: purchase.connections_purchased
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        status: session.payment_status 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error in verify-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});