import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  "/chat-assistant(.*)",
  "/assessment(.*)",
  "/profile(.*)"
]);

export default clerkMiddleware((auth, req) => {
  // Protect selected routes
  if (isProtectedRoute(req)) auth().protect();
});

// ✅ Define what to match (Clerk official config)
export const config = {
  matcher: [
    // Run middleware on all routes except Next internals and static files
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};
