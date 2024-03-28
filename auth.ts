import authConfig from "@/auth.config";
import prisma from "@/utils/prisma";
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
