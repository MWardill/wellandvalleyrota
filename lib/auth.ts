import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isAllowedEmail } from "./allowlist";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // Allowlist gate: only listed emails may complete sign-in.
    signIn({ profile, user }) {
      const email = profile?.email ?? user?.email ?? null;
      return isAllowedEmail(email, process.env.ALLOWED_EMAILS);
    },
  },
});
