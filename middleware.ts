import { auth } from "@/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  apiPublicRoutes,
} from "./routes";

export default auth(async (req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Check if the user is logged in
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // Categorize the route
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isApiPublicRoute = apiPublicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Allow API authentication and public API routes to proceed
  if (isApiAuthRoute || isApiPublicRoute) {
    return;
  }

  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Protect non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(authRoutes[0], nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
