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

    // Call backend learner registration endpoint
    const response = await api.post("/v1/auth/register/learner", body);

    // Return the full response
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
