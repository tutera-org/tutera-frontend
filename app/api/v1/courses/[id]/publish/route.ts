import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let body: { status: "DRAFT" | "PUBLISHED" | "ARCHIVED" } | undefined;
  try {
    const { id } = await params;
    body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!body?.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status value
    if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(body?.status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be DRAFT, PUBLISHED, or ARCHIVED" },
        { status: 400 }
      );
    }

    console.log("📤 [COURSE PUBLISH/UNPUBLISH] Course ID:", id);
    console.log("📤 [COURSE PUBLISH/UNPUBLISH] New status:", body?.status);

    const api = await getApiWithCookies();

    // Call backend: PATCH /v1/courses/:courseId/publish
    const response = await api.patch(`/v1/courses/${id}/publish`, {
      status: body?.status,
    });

    console.log("✅ [COURSE PUBLISH/UNPUBLISH] Success:", response.status);
    console.log(
      "✅ [COURSE PUBLISH/UNPUBLISH] Response:",
      JSON.stringify(response.data, null, 2)
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [COURSE PUBLISH/UNPUBLISH] Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "📝 [COURSE PUBLISH/UNPUBLISH] Backend error:",
        JSON.stringify(error.response.data, null, 2)
      );
      console.error(
        "📝 [COURSE PUBLISH/UNPUBLISH] Backend status:",
        error.response.status
      );
      if (body) {
        console.error(
          "📝 [COURSE PUBLISH/UNPUBLISH] Request body that failed:",
          JSON.stringify(body, null, 2)
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
