import NextAuth, { User as NextAuthUser } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { Role } from "@prisma/client";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      accessToken: string;
    } & NextAuthUser;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.error("Sign-in failed: No email provided.");
        return false; // Reject sign-in if no email
      }

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (existingUser) {
        console.log("User found, allowing sign-in:", existingUser.email);
        return true; // Allow existing users to sign in
      }

      try {
        // Create a new user only if they don't exist
        await db.user.create({
          data: {
            email: user.email,
            name: profile?.name, // Generate unique username
            image: user.image,
          },
        });

        console.log("New user created:", user.email);
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.accessToken) {
        session.user.accessToken = token.accessToken as string;
      }
      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
    async jwt({ token, account }) {
      console.log("account:", account);
      if (account) {
        token.accessToken = account.access_token;
      }
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
