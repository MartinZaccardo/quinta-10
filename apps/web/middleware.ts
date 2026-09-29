import { NextRequest, NextResponse } from "next/server";

function rolDelToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.rol ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si un usuario autenticado va al login o registro, mandarlo a su panel
  const { pathname } = request.nextUrl;
  if (pathname === "/login" || pathname === "/registro") {
    const destino =
      rolDelToken(token) === "ADMINISTRADOR"
        ? "/admin/disponibilidad"
        : "/cliente/disponibilidad";
    return NextResponse.redirect(new URL(destino, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*", "/login", "/registro"],
};
