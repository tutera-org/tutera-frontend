import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const api = await getApiWithCookies();

    // Call the backend logout endpoint
    const response = await api.post("/v1/auth/logout");

    console.log("✅ [LOGOUT] Backend logout successful");

    // Create response
    const nextResponse = NextResponse.json(
      {
        success: true,
        message: response.data?.message || "Logged out successfully",
      },
      {
        status: response.status,
      }
    );

    // Clear both cookies by setting them with expired date
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0, // Expire immediately
      path: "/",
    };

    nextResponse.cookies.set("accessToken", "", cookieOptions);
    console.log("   ✅ accessToken cookie cleared");

    nextResponse.cookies.set("refreshToken", "", cookieOptions);
    console.log("   ✅ refreshToken cookie cleared");

    return nextResponse;
  } catch (error) {
    console.error("❌ [LOGOUT ERROR] Logout failed:", error);

    const errorMessage = handleServerApiError(error);
    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    // Even if backend logout fails, clear cookies on client side
    const nextResponse = NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { status }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0,
      path: "/",
    };

    nextResponse.cookies.set("accessToken", "", cookieOptions);
    nextResponse.cookies.set("refreshToken", "", cookieOptions);
    console.log("   ⚠️ Cookies cleared despite backend error");

    return nextResponse;
  }
}
