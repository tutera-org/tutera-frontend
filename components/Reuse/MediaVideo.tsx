"use client";

import { useMediaUrl } from "@/hooks/useMediaUrl";

interface MediaVideoProps {
  mediaId?: string | null;
  fallbackUrl?: string | null; // For cases where we already have a signedUrl
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Reusable component for displaying media videos
 * Automatically fetches signed URL from mediaId
 * Falls back to fallbackUrl if provided (for newly uploaded files)
 * Shows placeholder if no mediaId or fallbackUrl
 */
export default function MediaVideo({
  mediaId,
  fallbackUrl,
  className = "",
  controls = true,
  autoPlay = false,
  muted = false,
  onLoad,
  onError,
}: MediaVideoProps) {
  const { signedUrl, isLoading, error } = useMediaUrl(mediaId);

  // Determine which URL to use: fallbackUrl (recent upload) > signedUrl (fetched) > null
  const videoUrl = fallbackUrl || signedUrl;

  // Show loading state
  if (isLoading && !videoUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  // Show error/placeholder state
  if (!videoUrl || error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
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
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <span className="text-gray-500 text-sm">Video not available</span>
        </div>
      </div>
    );
  }

  // Validate URL before using
  const isValidUrl =
    videoUrl.startsWith("http://") ||
    videoUrl.startsWith("https://") ||
    videoUrl.startsWith("data:");

  if (!isValidUrl) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Invalid video URL</span>
      </div>
    );
  }

  // Render video
  return (
    <video
      src={videoUrl}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      className={className}
      onLoadedData={onLoad}
      onError={onError}
    >
      Your browser does not support the video tag.
    </video>
  );
}

