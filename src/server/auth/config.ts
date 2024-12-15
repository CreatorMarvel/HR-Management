import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";
import type { Adapter } from "next-auth/adapters";
import { redirect } from "next/navigation";

interface GoogleProfile {
  sub: string; // Google user ID
  name?: string;
  email?: string;
  picture?: string;
  role?: string; // Role
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub, // Google user ID
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          role: profile.role ?? "user", // Default role to 'user'
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "text" },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        const email = credentials.username as string;
        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (user && user.password === credentials.password) {
          // Object will be saved in `user` property of the JWT
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ?? "user", // Ensure role is included
          };
        } else {
          return null;
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db) as Adapter,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Check if the user has a role in the token
      const role = url.includes("role=admin") ? "admin" : "user"; // In this example, we're assuming the role is passed in the URL as a query param

      // If the user is an admin, redirect to the dashboard
      if (role === "admin") {
        return `${baseUrl}/admin`; // Admins go to /dashboard
      }
      // If the user is a regular user, redirect to /employee
      else if (role === "user") {
        return `${baseUrl}/employee`; // Regular users go to /employee
      }

      // Default fallback if no specific role or unknown role
      return baseUrl; // Redirect to the homepage or fallback route
    },
  },
} satisfies NextAuthConfig;
