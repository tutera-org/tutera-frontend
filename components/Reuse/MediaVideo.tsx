"use client";

import { useVideoMediaUrl } from "@/hooks/useVideoMediaUrl";
import { useRef, useEffect } from "react";

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
 * Reusable component for displaying media videos with smart URL refresh
 * - Pre-fetches new URLs before expiration
 * - Only updates source when paused (prevents playback interruption)
 * - Handles error recovery automatically
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const { signedUrl, pendingUrl, isLoading, error, isPlaying, setIsPlaying, applyPendingUrl } = useVideoMediaUrl(mediaId);

  // Determine which URL to use: fallbackUrl (recent upload) > signedUrl (fetched) > null
  const videoUrl = fallbackUrl || signedUrl;

  // Track video playback state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [setIsPlaying]);

  // Apply pending URL when video pauses
  useEffect(() => {
    if (!isPlaying && pendingUrl && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      // Apply pending URL
      applyPendingUrl();
      
      // Restore playback position and state after URL change
      videoRef.current.addEventListener(
        "loadedmetadata",
        () => {
          if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
            if (wasPlaying) {
              videoRef.current.play().catch(console.error);
            }
          }
        },
        { once: true }
      );
    }
  }, [isPlaying, pendingUrl, applyPendingUrl]);

  // Handle error recovery - if video fails to load, refresh URL
  const handleVideoError = () => {
    if (onError) {
      onError();
    }
    
    // Try to refresh URL if we have a mediaId
    if (mediaId && !fallbackUrl) {
      // The hook will handle retry on next interval
      // But we can also trigger immediate refresh if needed
      console.warn("Video error detected, will retry on next refresh");
    }
  };

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
      ref={videoRef}
      src={videoUrl}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      className={className}
      onLoadedData={onLoad}
      onError={handleVideoError}
    >
      Your browser does not support the video tag.
    </video>
  );
}

