import { Order } from "@/models/Order";
import mongoose from "mongoose";

export async function GET(req) {
    await mongoose.connect(process.env.MONGO_URL);
    
    const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate('items.menuItemId');
    
    return Response.json(orders);
}

export async function PUT(req) {
    await mongoose.connect(process.env.MONGO_URL);
    
    const { _id, ...data } = await req.json();
    await Order.findByIdAndUpdate(_id, data);
    
    return Response.json(true);
}
