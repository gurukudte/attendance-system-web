import { auth } from "@/auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

/**
 * Middleware function to handle authentication and route protection.
 *
 * @param {Request} req - The incoming request object.
 * @returns {Response | void} - A response object for redirection or void to allow the request to proceed.
 *
 * This middleware performs the following tasks:
 * - Checks if the user is logged in.
 * - Categorizes the route as API authentication, public, or authentication route.
 * - Allows API authentication routes to proceed without any checks.
 * - Handles authentication routes by redirecting logged-in users away from these routes.
 * - Protects non-public routes by redirecting unauthenticated users to the login page.
 * - Allows all other requests to proceed.
 */

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Check if the user is logged in
  const isLoggedIn = !!req.auth;

  // Categorize the route
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  // Allow API authentication routes to proceed
  if (isApiAuthRoute) {
    return;
  }

  // Handle authentication routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect logged-in users away from auth routes
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // Allow unauthenticated users to access auth routes
    return;
  }

  // Protect non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    // Redirect unauthenticated users to the login page
    return Response.redirect(new URL(authRoutes[0], nextUrl));
  }

  // Allow all other requests to proceed
  return;
});

// Middleware configuration
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
