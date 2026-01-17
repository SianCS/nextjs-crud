import prisma from "@/lib/prisma";
import { signInFormSchema } from "@/lib/schemas/auth.schema";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { ROUTE } from "@/constants/route";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: ROUTE.SIGN_IN,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { data, success } = signInFormSchema.safeParse(credentials);
        if (!success) return null;

        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.id = user.id;
      }
      return token;
    },
    session({ token, session }) {
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      if (token.id) session.user.id = token.id;
      return session;
    },
  },
});
