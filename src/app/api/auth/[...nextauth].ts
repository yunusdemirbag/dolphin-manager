import NextAuth, { type NextAuthOptions } from "next-auth";
import EtsyProvider from "next-auth/providers/etsy";

export const authOptions: NextAuthOptions = {
  providers: [
    EtsyProvider({
      clientId: process.env.ETSY_API_KEY!,
      clientSecret: process.env.ETSY_CLIENT_SECRET!,
      authorization: {
        url: "https://www.etsy.com/oauth/connect",
        params: {
          response_type: "code",
          scope: "email listings_r shops_r transactions_r profile_r",
        },
      },
      token: "https://api.etsy.com/v3/public/oauth/token",
      userinfo: "https://api.etsy.com/v3/application/user",
      checks: ["pkce", "state"],
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.access_token;
      return session;
    },
    async redirect() {
      return `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        domain: ".vercel.app",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        domain: ".vercel.app",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
};

export default NextAuth(authOptions); 