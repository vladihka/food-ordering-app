import mongoose from "mongoose";
import Stripe from "stripe";
import { Order } from "@/models/Order";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await mongoose.connect(process.env.MONGO_URL);
      await Order.findByIdAndUpdate(orderId, { paid: true });
    }
  }

  return new Response('ok');
}

export const config = {
  api: {
    bodyParser: false,
  },
};



