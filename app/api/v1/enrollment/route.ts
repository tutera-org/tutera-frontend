import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const api = await getApiWithCookies();

    const body = await request.json();

    const response = await api.post("/v1/enrollments/enroll", body);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const errorMessage = handleServerApiError(error);
    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status }
    );
  }
}
