"use client";

import { useState, useRef, useEffect } from "react";
import { useVideoMediaUrl } from "@/hooks/useVideoMediaUrl";

interface CustomVideoPlayerProps {
  src?: string; // Direct URL (for backward compatibility)
  mediaId?: string | null; // Media ID for smart URL refresh (preferred)
  fallbackUrl?: string | null; // Fallback URL if provided
  width?: number;
  height?: number;
  className?: string;
}

export default function CustomVideoPlayer({
  src,
  mediaId,
  fallbackUrl,
  
  className = "",
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Use smart video URL hook if mediaId is provided, otherwise use direct src
  const {
    signedUrl,
    pendingUrl,
    isLoading: isUrlLoading,
    error: urlError,
    isPlaying,
    setIsPlaying,
    applyPendingUrl,
  } = useVideoMediaUrl(mediaId);

  // Determine video source: fallbackUrl > signedUrl (from hook) > src (direct) > null
  const videoUrl = fallbackUrl || signedUrl || src || null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    // Reset video when URL changes
    if (videoUrl) {
      video.load();
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoUrl, setIsPlaying]);

  // Apply pending URL when video pauses (smart refresh)
  useEffect(() => {
    if (!isPlaying && pendingUrl && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;

      // Apply pending URL
      applyPendingUrl();

      // Restore playback position and state after URL change
      const handleLoadedMetadata = () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime;
          if (wasPlaying) {
            videoRef.current.play().catch(console.error);
          }
        }
      };

      videoRef.current.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
        { once: true }
      );

      // Trigger reload
      videoRef.current.load();
    }
  }, [isPlaying, pendingUrl, applyPendingUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    // State will be updated by event listeners
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, video.currentTime + 10);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * duration;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`relative bg-white lg:w-[80%] lg:h-full overflow-hidden rounded-2xl ${className}`}
      
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {isUrlLoading && !videoUrl ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : urlError && !videoUrl ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <p className="text-lg mb-2">Video unavailable</p>
            <p className="text-sm text-gray-400">{urlError}</p>
          </div>
        </div>
      ) : videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-center"
          onClick={togglePlay}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p>No video source available</p>
        </div>
      )}

      {/* Overlay Controls */}
      {showControls && videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Center Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="pointer-events-auto bg-[#4977E6] rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg hover:bg-[#3d66d4] transition-colors z-10"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white sm:w-[50px] sm:h-[50px]"
              >
                <rect x="6" y="4" width="4" height="16" fill="currentColor" />
                <rect x="14" y="4" width="4" height="16" fill="currentColor" />
              </svg>
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white ml-1 sm:w-[50px] sm:h-[50px]"
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Skip Backward Button */}
          <button
            onClick={skipBackward}
            className="pointer-events-auto absolute left-4 sm:left-[20%] md:left-[25%] lg:left-[30%] text-white hover:opacity-80 transition-opacity z-10"
            aria-label="Skip backward 10 seconds"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="sm:w-8 sm:h-8"
            >
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>

          {/* Skip Forward Button */}
          <button
            onClick={skipForward}
            className="pointer-events-auto absolute right-4 sm:right-[20%] md:right-[25%] lg:right-[30%] text-white hover:opacity-80 transition-opacity z-10"
            aria-label="Skip forward 10 seconds"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="sm:w-8 sm:h-8"
            >
              <polygon points="13 5 22 12 13 19 13 5" />
              <polygon points="2 5 11 12 2 19 2 5" />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom Progress Bar */}
      {videoUrl && (
        <div className="absolute bottom-6 left-0 right-0  pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3">
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="flex-1 h-1.5 sm:h-2.5 bg-white rounded-full cursor-pointer relative"
            >
              <div
                className="absolute left-0 top-0 h-full bg-[#4977E6] rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
              />
            </div>

            {/* Time Display */}
            <span className="text-white bg-black/30 rounded-full p-2 text-xs sm:text-sm font-bold min-w-[80px] sm:min-w-[100px] text-center whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume Control */}
            <button
              onClick={toggleMute}
              className="text-black bg-white rounded-full p-2 hover:opacity-80 transition-opacity shrink-0"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="sm:w-6 sm:h-6"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="sm:w-6 sm:h-6"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
