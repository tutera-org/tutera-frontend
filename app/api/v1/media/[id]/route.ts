import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    console.log("📥 [GET MEDIA] Fetching signed URL for mediaId:", id);

    const api = await getApiWithCookies();

    // Get cookies to forward
    const cookieHeader = request.headers.get("cookie") || "";

    const response = await api.get(`/v1/media/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [GET MEDIA] Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("📝 [GET MEDIA] Backend error:", error.response.data);
      console.error("📝 [GET MEDIA] Backend status:", error.response.status);
    }

    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}

