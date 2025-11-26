"use client";

import Image from "next/image";
import { useMediaUrl } from "@/hooks/useMediaUrl";

interface MediaImageProps {
  mediaId?: string | null;
  fallbackUrl?: string | null; // For cases where we already have a signedUrl
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Reusable component for displaying media images
 * Automatically fetches signed URL from mediaId
 * Falls back to fallbackUrl if provided (for newly uploaded files)
 * Shows placeholder if no mediaId or fallbackUrl
 */
export default function MediaImage({
  mediaId,
  fallbackUrl,
  alt,
  fill = false,
  width,
  height,
  className = "",
  objectFit = "cover",
  priority = false,
  onLoad,
  onError,
}: MediaImageProps) {
  const { signedUrl, isLoading, error } = useMediaUrl(mediaId);

  // Determine which URL to use: fallbackUrl (recent upload) > signedUrl (fetched) > null
  const imageUrl = fallbackUrl || signedUrl;

  // Show loading state
  if (isLoading && !imageUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  // Show error/placeholder state
  if (!imageUrl || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  // Validate URL before using with Next.js Image
  const isValidUrl =
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:");

  if (!isValidUrl) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <span className="text-gray-500 text-sm">Invalid image URL</span>
      </div>
    );
  }

  // Render image
  // Use unoptimized for signed URLs since they're temporary and auto-refresh
  // This bypasses Next.js image optimization which can fail with signed URLs
  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        style={{ objectFit }}
        priority={priority}
        unoptimized={true} // Bypass Next.js optimization for signed URLs
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit }}
      priority={priority}
      unoptimized={true} // Bypass Next.js optimization for signed URLs
      onLoad={onLoad}
      onError={onError}
    />
  );
}

