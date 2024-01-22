import { authMiddleware } from "@clerk/nextjs";

// var routes = ["/api", "/sign-in"]

export default authMiddleware({
  // publicRoutes: ["/api", "/sign-in"]
  // publicRoutes: ["/"]
  // ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/sign-in"],
  publicRoutes: (req) => req.url.includes("/api") || req.url.includes("/sign-in") || req.url.includes("/sign-up"),
  // publicRoutes: req => req.url.includes("/api")
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 
 