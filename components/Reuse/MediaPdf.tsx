"use client";

import { usePdfMediaUrl } from "@/hooks/usePdfMediaUrl";

interface MediaPdfProps {
  mediaId?: string | null;
  fallbackUrl?: string | null; // For cases where we already have a signedUrl
  className?: string;
  height?: number | string;
  title?: string;
}

/**
 * Reusable component for displaying PDF documents
 * Automatically fetches signed URL from mediaId with auto-refresh
 * Falls back to fallbackUrl if provided (for newly uploaded files)
 */
export default function MediaPdf({
  mediaId,
  fallbackUrl,
  className = "",
  height = "600px",
  title = "PDF Document",
}: MediaPdfProps) {
  const { signedUrl, isLoading, error } = usePdfMediaUrl(mediaId);

  // Determine which URL to use: fallbackUrl (recent upload) > signedUrl (fetched) > null
  const pdfUrl = fallbackUrl || signedUrl;

  // Show loading state
  if (isLoading && !pdfUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  // Show error/placeholder state
  if (!pdfUrl || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 mx-auto mb-2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-gray-500 text-sm">
            {error || "PDF not available"}
          </span>
        </div>
      </div>
    );
  }

  // Validate URL before using
  const isValidUrl =
    pdfUrl.startsWith("http://") ||
    pdfUrl.startsWith("https://") ||
    pdfUrl.startsWith("data:");

  if (!isValidUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <span className="text-gray-500 text-sm">Invalid PDF URL</span>
      </div>
    );
  }

  // Render PDF in iframe
  return (
    <iframe
      src={pdfUrl}
      className={className}
      style={{ height, width: "100%" }}
      title={title}
    />
  );
}

