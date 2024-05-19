import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt/verfityToken";

const protectedRoutes = ['/privatePage'];
const publicRoutes = ['/auth/login', '/auth/signup', '/'];

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;

    const isProtectedRoute = protectedRoutes.includes(pathname);
    const isPublicRoute = publicRoutes.includes(pathname);

    const verifyT = token && await verifyToken(token, process.env.JWT_SECRET_KEY as string);
    // const access_role = verifyT && verifyT?.email
    console.log(verifyT)

    if(pathname == "/auth/login" || pathname == "/auth/signup"){
        if(token && role){
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }
        return NextResponse.next();
    }

    // Allow requests to public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Debugging log to ensure middleware runs
    console.log("Middleware is running");

    // Handle protected routes
    if (isProtectedRoute) {
        if(token && role){
            if(role == "admin"){
                return NextResponse.next();
            }else{
                return NextResponse.redirect(new URL("/auth/unAuthorized", req.nextUrl));
            }
        }else{
            return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
        }
    }

    // Default response for other routes
    return NextResponse.next();
}

export const config = {
    // Matcher to exclude specific routes
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
