import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    console.log("📤 [COURSE UPDATE] Course ID:", id);
    console.log(
      "📤 [COURSE UPDATE] Request body:",
      JSON.stringify(body, null, 2)
    );

    const api = await getApiWithCookies();

    // The axios instance from getApiWithCookies already includes cookies in headers
    // User specified: PUT https://tutera-backend.onrender.com/api/v1/courses/:courseId
    // The baseURL already includes /api, so we only need /v1/courses/${id} (matching POST route pattern)
    const updateUrl = `/v1/courses/${id}`;
    console.log(
      "📤 [COURSE UPDATE] Full URL will be:",
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${updateUrl}`
    );

    const response = await api.put(updateUrl, body);

    console.log("✅ [COURSE UPDATE] Success:", response.status);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [COURSE UPDATE] Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("📝 [COURSE UPDATE] Backend error:", error.response.data);
      console.error(
        "📝 [COURSE UPDATE] Backend status:",
        error.response.status
      );
    }

    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    console.log("🗑️ [COURSE DELETE] Course ID:", id);
    console.log(
      "🔗 [COURSE DELETE] Backend URL:",
      process.env.NEXT_PUBLIC_BACKEND_API_URL
    );

    const api = await getApiWithCookies();

    // The axios instance from getApiWithCookies already includes cookies in headers
    // User specified: DELETE https://tutera-backend.onrender.com/api/v1/courses/:courseId
    // The baseURL already includes /api, so we only need /v1/courses/${id} (matching POST route pattern)
    const deleteUrl = `/v1/courses/${id}`;
    console.log(
      "📤 [COURSE DELETE] Full URL will be:",
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}${deleteUrl}`
    );
    console.log("📤 [COURSE DELETE] Course ID being sent:", id);
    console.log("📤 [COURSE DELETE] ID type:", typeof id);
    console.log("📤 [COURSE DELETE] ID length:", id?.length);

    const response = await api.delete(deleteUrl);

    console.log("✅ [COURSE DELETE] Success:", response.status);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [COURSE DELETE] Error:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "📝 [COURSE DELETE] Backend error response:",
          JSON.stringify(error.response.data, null, 2)
        );
        console.error(
          "📝 [COURSE DELETE] Backend status:",
          error.response.status
        );
        console.error(
          "📝 [COURSE DELETE] Backend headers:",
          error.response.headers
        );
      } else if (error.request) {
        console.error(
          "📝 [COURSE DELETE] No response received:",
          error.request
        );
      } else {
        console.error(
          "📝 [COURSE DELETE] Error setting up request:",
          error.message
        );
      }
    }

    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
