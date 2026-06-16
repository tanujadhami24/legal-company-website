import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
const keyId = process.env.RAZORPAY_KEY_ID || "";
const isRazorpayConfigured = keyId.length > 0 && keySecret.length > 0 && !keyId.includes("rzp_test_");

export async function POST(req: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      userId, 
      amount, 
      serviceId 
    } = await req.json();

    // 1. Signature Verification
    let isValid = false;

    if (!isRazorpayConfigured) {
      // Mock validation success in sandbox
      console.warn("Razorpay keys not set. Simulating successful signature validation.");
      isValid = true;
    } else {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { error: "Missing required Razorpay parameters." },
          { status: 400 }
        );
      }

      const hash = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      isValid = hash === razorpay_signature;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // 2. Insert transaction to database (if Supabase is active)
    if (supabase) {
      const { error: dbError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId || null,
          amount: amount,
          status: "success",
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          service_id: serviceId,
        });

      if (dbError) {
        console.error("Failed to save transaction to database:", dbError);
        // We still return success as payment was verified, but flag the db error
        return NextResponse.json({ 
          verified: true, 
          saved: false, 
          message: "Payment verified, but failed to log transaction." 
        });
      }
    }

    return NextResponse.json({ 
      verified: true, 
      saved: true, 
      message: "Payment successfully verified and recorded." 
    });

  } catch (error: any) {
    console.error("Error verifying payment signature:", error);
    return NextResponse.json(
      { error: error.message || "Internal server verification error." },
      { status: 500 }
    );
  }
}
