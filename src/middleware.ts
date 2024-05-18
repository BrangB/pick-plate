import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ['/privatePage'];
const publicRoutes = ['/auth/login', '/auth/signup', '/'];

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    // Allow requests to public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Debugging log to ensure middleware runs
    console.log("Middleware is running");

    // Handle protected routes
    if (isProtectedRoute) {
        if (!token || !role) {
            return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
        }
        // Debugging log for token and role
        console.log("Token:", token, "Role:", role);
        return NextResponse.next();
    }

    // Default response for other routes
    return NextResponse.next();
}

export const config = {
    // Matcher to exclude specific routes
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
