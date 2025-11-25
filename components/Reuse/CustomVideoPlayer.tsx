"use client";

import { useState, useRef, useEffect } from "react";

interface CustomVideoPlayerProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function CustomVideoPlayer({
  src,
  width = 850,
  height = 550,
  className = "",
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
//   const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
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
      className={`relative bg-white  overflow-hidden ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-center"
        onClick={togglePlay}
      />

      {/* Overlay Controls */}
      {showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Center Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="pointer-events-auto bg-[#4977E6] rounded-full w-18 h-18 flex items-center justify-center shadow-lg hover:bg-[#3d66d4] transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
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
                className="text-white ml-1"
              >
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Skip Backward Button */}
          <button
            onClick={skipBackward}
            className="pointer-events-auto absolute left-[35%]  text-white hover:opacity-80 transition-opacity"
            aria-label="Skip backward 10 seconds"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="11 19 2 12 11 5 11 19" />
              <polygon points="22 19 13 12 22 5 22 19" />
            </svg>
          </button>

          {/* Skip Forward Button */}
          <button
            onClick={skipForward}
            className="pointer-events-auto absolute right-[35%] text-white hover:opacity-80 transition-opacity"
            aria-label="Skip forward 10 seconds"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon points="13 5 22 12 13 19 13 5" />
              <polygon points="2 5 11 12 2 19 2 5" />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            onClick={handleProgressClick}
            className="flex-1 h-1.5 bg-white/30 rounded-full cursor-pointer relative"
          >
            <div
              className="absolute left-0 top-0 h-full bg-[#4977E6] rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"
              style={{ left: `calc(${progressPercentage}% - 8px)` }}
            />
          </div>

          {/* Time Display */}
          <span className="text-white text-sm font-medium min-w-[100px] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Volume Control */}
          <button
            onClick={toggleMute}
            className="text-white hover:opacity-80 transition-opacity"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
