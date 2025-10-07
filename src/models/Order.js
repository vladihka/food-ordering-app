import mongoose, { Schema, models, model } from "mongoose";

const CartExtraSchema = new Schema({
    name: String,
    price: Number,
});

const CartSizeSchema = new Schema({
    name: String,
    price: Number,
});

const CartItemSchema = new Schema({
    menuItemId: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
    image: { type: String },
    basePrice: { type: Number, required: true },
    size: { type: CartSizeSchema, default: null },
    extras: { type: [CartExtraSchema], default: [] },
});

const OrderSchema = new Schema(
  {
    userEmail: { type: String },
    items: { type: [CartItemSchema], required: true },
    subtotal: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    phone: { type: String },
    streetAddress: { type: String },
    postalCode: { type: String },
    city: { type: String },
    country: { type: String },
    paid: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);



