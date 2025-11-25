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
    // Extract the id from params
    const { id } = await params;
    const api = await getApiWithCookies();

    // Use the actual id in the API call
    const response = await api.get(`/v1/courses/${id}/details`);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    console.log(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
