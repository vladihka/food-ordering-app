import { Order } from "@/models/Order";
import mongoose from "mongoose";
import Stripe from "stripe";

export async function POST(req) {
    const body = await req.json();
    const { items, address, userEmail, currency = 'usd' } = body;

    if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ error: 'No items' }), { status: 400 });
    }

    await mongoose.connect(process.env.MONGO_URL);

    const subtotal = items.reduce((sum, p) => {
        let price = p.basePrice;
        if (p.size?.price) price += p.size.price;
        if (Array.isArray(p.extras)) {
            for (const ex of p.extras) price += ex.price || 0;
        }
        return sum + price;
    }, 0);

    const order = await Order.create({
        userEmail: userEmail || null,
        items: items.map(p => ({
            menuItemId: p._id,
            name: p.name,
            image: p.image,
            basePrice: p.basePrice,
            size: p.size || null,
            extras: p.extras || [],
        })),
        subtotal,
        currency,
        phone: address?.phone,
        streetAddress: address?.streetAddress,
        postalCode: address?.postalCode,
        city: address?.city,
        country: address?.country,
        paid: false,
    });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = items.map(p => {
        let unitAmount = p.basePrice;
        if (p.size?.price) unitAmount += p.size.price;
        if (Array.isArray(p.extras)) {
            for (const ex of p.extras) unitAmount += ex.price || 0;
        }
        return {
            price_data: {
                currency,
                product_data: { name: p.name },
                unit_amount: Math.round(unitAmount * 100),
            },
            quantity: 1,
        };
    });

    const origin = req.headers.get('origin') || process.env.PUBLIC_BASE_URL;
    const success_url = `${origin}/cart?success=1`;
    const cancel_url = `${origin}/cart?canceled=1`;

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items,
        success_url,
        cancel_url,
        metadata: { orderId: String(order._id) },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return Response.json({ id: session.id, url: session.url });
}



