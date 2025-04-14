/**
 * Public routes that do not require authentication.
 *
 * @constant {string[]}
 */
export const publicRoutes = ["/"];
export const apiPublicRoutes = [
  // Add other public API routes here
];

/**
 * Routes for authentication.
 *
 * @constant {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/signup"];

/**
 * Prefix for authentication-related API routes.
 *
 * @constant {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default URL to which users are redirected after a successful login.
 *
 * @constant {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
