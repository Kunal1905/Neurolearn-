import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ✅ Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect selected routes
  if (isProtectedRoute(req)) {
    auth.protect();
    
    // If user is accessing the root workspace path, redirect based on assessment status
    if (req.nextUrl.pathname === '/workspace') {
      const { userId } = auth;
      if (userId) {
        try {
          // For now, we'll redirect to assessment start by default
          // In a real implementation, you would check if the user has completed the assessment
          const url = req.nextUrl.clone();
          url.pathname = '/workspace/assessment/start';
          return Response.redirect(url);
        } catch (error) {
          // If there's an error checking assessment, redirect to start
          const url = req.nextUrl.clone();
          url.pathname = '/workspace/assessment/start';
          return Response.redirect(url);
        }
      }
    }
  }
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