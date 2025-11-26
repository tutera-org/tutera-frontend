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

    // Validate ID
    if (!id) {
      return NextResponse.json(
        { error: "Enrollment ID is required" },
        { status: 400 }
      );
    }

    const api = await getApiWithCookies();
    const response = await api.get(`/v1/enrollments/${id}/details`);

    // Return the actual data (adjust based on your API structure)
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const errorMessage = handleServerApiError(error);
    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
