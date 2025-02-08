import { User } from "@/models/User";
import mongoose from "mongoose";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";

type Credentials = {
  email: string;
  password: string;
};

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials?: Partial<Credentials>) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await mongoose.connect(process.env.MONGO_URL!);
        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }

        const passwordOk = bcrypt.compareSync(
          credentials.password,
          user.password
        );
        if (!passwordOk) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
