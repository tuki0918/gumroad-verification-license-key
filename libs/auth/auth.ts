import authConfig from "@/libs/auth/auth.config";
import prisma from "@/libs/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  ...authConfig,
});
