import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const api = await getApiWithCookies();

    const response = await api.get("/v1/creator/dashboard");

    return NextResponse.json(
      { success: true, data: response.data },
      { status: response.status }
    );
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
