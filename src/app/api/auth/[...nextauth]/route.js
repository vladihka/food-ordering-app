import { NextResponse } from "next/server";
import { User } from "@/models/User";
import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await mongoose.connect(process.env.MONGO_URL);
        const user = await User.findOne({ email: credentials.email });

        if (!user) return null;

        const passwordOk = bcrypt.compareSync(credentials.password, user.password);
        if (!passwordOk) return null;

        return user;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

// **Новый экспорт для App Router (Next.js 13+)**
export const GET = (req) => handler(req, NextResponse);
export const POST = (req) => handler(req, NextResponse);
