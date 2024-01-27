import { DefaultSession } from "next-auth";
import "next-auth/jwt";

enum UserRole {
  Admin = "admin",
  User = "user",
}

declare module "@auth/core/types" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
  interface User {
    role: UserRole;
  }
}

declare module "next-auth" {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role: UserRole;
  }
}
