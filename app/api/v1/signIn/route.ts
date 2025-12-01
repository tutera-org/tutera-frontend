import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const api = await getApiWithCookies();

    const response = await api.post("/v1/auth/login", body);

    const { accessToken, refreshToken } = response.data.data.tokens;
    const { user, tenant } = response.data.data;

    const responseData = {
      ...response.data,
      data: {
        ...response.data.data,
        // Keep tokens in response so client can store in Zustand
        // The cookie is still set for server-side use
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    };

    const nextResponse = NextResponse.json(responseData, {
      status: response.status,
    });

    // Simple cookie configuration
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    };

    // Set accessToken cookie
    nextResponse.cookies.set("accessToken", accessToken, cookieOptions);
    console.log("   ✅ accessToken cookie set");

    // Set refreshToken cookie
    nextResponse.cookies.set("refreshToken", refreshToken, cookieOptions);
    console.log("   ✅ refreshToken cookie set");

    return nextResponse;
  } catch (error) {
    const errorMessage = handleServerApiError(error);
    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
