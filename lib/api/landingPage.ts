import { backendApi } from "@/lib/axiosZustandInstance";
import {
  ApiResponse,
  LandingPageResponse,
  UploadImageResponse,
  CustomizationFormData,
} from "@/components/creatorSettings/types";

const BASE_PATH = "/v1/creator/landing-page";

/**
 * Get the current tenant's landing page
 * Creates default if none exists
 */
export async function getLandingPage(): Promise<LandingPageResponse> {
  const response = await backendApi.get<ApiResponse<LandingPageResponse>>(
    BASE_PATH
  );
  return response.data.data;
}

/**
 * Upload an image and automatically update the landing page section
 * @param file - The image file to upload
 * @param section - The section to update: "logo" | "section1" | "section2" | "section3" | "section4" | "section5"
 * @param testimonialIndex - Optional: Index of testimonial (only for section5)
 */
export async function uploadImage(
  file: File,
  section: "logo" | "section1" | "section2" | "section3" | "section4" | "section5",
  testimonialIndex?: number
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("section", section);
  if (testimonialIndex !== undefined) {
    formData.append("testimonialIndex", testimonialIndex.toString());
  }

  const response = await backendApi.post<ApiResponse<UploadImageResponse>>(
    `${BASE_PATH}/upload-image`,
    formData
    // Note: Don't set Content-Type header manually - axios will set it automatically
    // with the correct boundary for multipart/form-data
  );
  return response.data.data;
}

/**
 * Create a new landing page (only if none exists)
 */
export async function createLandingPage(
  data: Partial<CustomizationFormData>
): Promise<LandingPageResponse> {
  const response = await backendApi.post<ApiResponse<LandingPageResponse>>(
    BASE_PATH,
    data
  );
  return response.data.data;
}

/**
 * Update the entire landing page (replaces all sections)
 */
export async function updateLandingPage(
  data: Partial<CustomizationFormData>
): Promise<LandingPageResponse> {
  const response = await backendApi.put<ApiResponse<LandingPageResponse>>(
    BASE_PATH,
    data
  );
  return response.data.data;
}

/**
 * Partial update - update specific fields only
 */
export async function patchLandingPage(
  data: Partial<CustomizationFormData> & {
    sections?: Partial<CustomizationFormData["sections"]>;
  } & Record<string, unknown>
): Promise<LandingPageResponse> {
  const response = await backendApi.patch<ApiResponse<LandingPageResponse>>(
    BASE_PATH,
    data
  );
  return response.data.data;
}

