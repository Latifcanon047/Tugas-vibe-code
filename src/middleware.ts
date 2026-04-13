import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      const method = req.method;

      if (pathname.startsWith("/api/transactions")) {
        if (pathname === "/api/transactions" && method === "GET") {
          return true;
        }
        return !!token;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/api/transactions", "/api/transactions/:path*"],
};
