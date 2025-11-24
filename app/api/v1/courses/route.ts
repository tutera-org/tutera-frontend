import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📤 [COURSE CREATE] Request body:", JSON.stringify(body, null, 2));

    const api = await getApiWithCookies();

    const response = await api.post("/v1/courses", body);

    console.log("✅ [COURSE CREATE] Success:", response.status);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [COURSE CREATE] Error:", error);
    
    if (axios.isAxiosError(error) && error.response) {
      console.error("📝 [COURSE CREATE] Backend error:", error.response.data);
      console.error("📝 [COURSE CREATE] Backend status:", error.response.status);
    }

    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function GET(request: NextRequest) {
  try {
    const api = await getApiWithCookies();

    const response = await api.get("/v1/courses");

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}

