import {
  getApiWithCookies,
  handleServerApiError,
} from "@/lib/axiosServerInstance";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";

// Configure route to accept large file uploads (up to 2GB)
// Note: Next.js App Router API routes have no default body size limit
// The maxDuration allows longer processing time for large uploads
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for large uploads
export const dynamic = "force-dynamic"; // Ensure dynamic rendering for file uploads

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Log file size for debugging
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const fileSizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
    
    console.log("📤 [MEDIA UPLOAD] File received:", {
      name: file.name,
      size: file.size,
      sizeMB: `${fileSizeMB} MB`,
      sizeGB: `${fileSizeGB} GB`,
      type: file.type,
    });

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use form-data package for Node.js (works properly with axios)
    const uploadFormData = new FormData();
    uploadFormData.append("file", buffer, {
      filename: file.name || "file",
      contentType: file.type || "application/octet-stream",
    });

    const api = await getApiWithCookies();

    // Get cookies to forward
    const cookieHeader = request.headers.get("cookie") || "";

    // Configure request with form-data headers
    const config = {
      headers: {
        ...uploadFormData.getHeaders(), // This sets Content-Type with boundary
        Cookie: cookieHeader,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    console.log("📤 [MEDIA UPLOAD] Forwarding to backend...");
    console.log("📤 [MEDIA UPLOAD] File details:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const response = await api.post("/v1/media/upload", uploadFormData, config);
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error("❌ [MEDIA UPLOAD] Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("📝 [MEDIA UPLOAD] Backend error:", error.response.data);
      console.error("📝 [MEDIA UPLOAD] Backend status:", error.response.status);
    }

    const errorMessage = handleServerApiError(error);

    const status = axios.isAxiosError(error)
      ? error.response?.status || 500
      : 500;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
