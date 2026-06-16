import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

const isRazorpayConfigured = keyId.length > 0 && keySecret.length > 0 && !keyId.includes("rzp_test_");

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : null;

export async function POST(req: Request) {
  try {
    const { amount, serviceId } = await req.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Invalid amount parameter." },
        { status: 400 }
      );
    }

    const receipt = `rcpt_${serviceId}_${Date.now()}`;
    const amountInPaise = Math.round(amount * 100);

    if (!isRazorpayConfigured || !razorpay) {
      // Fallback sandbox mock order creation
      console.warn("Razorpay environment keys are not configured. Returning mock order details.");
      return NextResponse.json({
        id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
        amount: amountInPaise,
        currency: "INR",
        receipt: receipt,
        status: "created",
        isMock: true
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
      isMock: false
    });

  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment order." },
      { status: 500 }
    );
  }
}
