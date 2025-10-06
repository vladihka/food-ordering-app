import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";
import { User } from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password || "";

        await mongoose.connect(process.env.MONGO_URL);

        // Case-insensitive email lookup to support legacy mixed-case records
        const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const user =
          (await User.findOne({ email })) ||
          (await User.findOne({ email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } }));

        if (!user || !user.password) {
          return null;
        }

        try {
          const passwordMatches = bcrypt.compareSync(password, user.password);
          if (passwordMatches) {
            // Return a plain object with an id so NextAuth accepts it
            return {
              id: String(user._id),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        } catch (_e) {
          return null;
        }

        return null;
      },
    }),
  ],
};

export default authOptions;
