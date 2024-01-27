import authConfig from "@/auth.config";
import { client } from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(client),
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
