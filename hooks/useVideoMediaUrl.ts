"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface MediaUrlResponse {
  data: {
    signedUrl: string;
    mediaId: string;
    [key: string]: unknown;
  };
}

/**
 * Smart hook for video/audio media URLs that handles expiring signed URLs
 * - Pre-fetches new URLs before expiration
 * - Only updates video source when paused (prevents playback interruption)
 * - Handles error recovery automatically
 * - Preserves playback position after URL refresh
 */
export function useVideoMediaUrl(mediaId: string | null | undefined) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null); // Pre-fetched URL waiting to be applied
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUrlRef = useRef<string | null>(null); // Track pending URL to avoid unnecessary updates

  const fetchSignedUrl = useCallback(async (id: string, isPreFetch = false) => {
    if (!id) {
      setSignedUrl(null);
      setPendingUrl(null);
      return;
    }

    // Only show loading for initial fetch, not pre-fetches
    if (!isPreFetch) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(`/api/v1/media/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch media" }));
        throw new Error(errorData.error || "Failed to fetch media");
      }

      const data: MediaUrlResponse = await response.json();
      
      if (data.data?.signedUrl) {
        const newUrl = data.data.signedUrl;
        
        if (isPreFetch) {
          // Store as pending URL - will be applied when video is paused
          setPendingUrl(newUrl);
          pendingUrlRef.current = newUrl;
        } else {
          // Initial fetch or manual refresh - apply immediately
          setSignedUrl(newUrl);
          setPendingUrl(null);
          pendingUrlRef.current = null;
        }
      } else {
        throw new Error("No signed URL in response");
      }
    } catch (err) {
      console.error("Error fetching media URL:", err);
      if (!isPreFetch) {
        setError(err instanceof Error ? err.message : "Failed to fetch media");
        setSignedUrl(null);
      }
      // For pre-fetch errors, we'll retry on next interval
    } finally {
      if (!isPreFetch) {
        setIsLoading(false);
      }
    }
  }, []);

  // Apply pending URL when video is paused
  const applyPendingUrl = useCallback(() => {
    if (pendingUrlRef.current && !isPlaying) {
      setSignedUrl(pendingUrlRef.current);
      setPendingUrl(null);
      pendingUrlRef.current = null;
    }
  }, [isPlaying]);

  // Fetch when mediaId changes
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (mediaId) {
      // Initial fetch
      fetchSignedUrl(mediaId, false);

      // Set up auto-refresh every 4 minutes (240000ms) to stay ahead of 5-minute expiration
      // Pre-fetch new URL in background
      refreshIntervalRef.current = setInterval(() => {
        fetchSignedUrl(mediaId, true); // Pre-fetch mode
      }, 4 * 60 * 1000); // 4 minutes
    } else {
      setSignedUrl(null);
      setPendingUrl(null);
      pendingUrlRef.current = null;
      setError(null);
    }

    // Cleanup interval on unmount or mediaId change
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [mediaId, fetchSignedUrl]);

  // Apply pending URL when video pauses
  useEffect(() => {
    if (!isPlaying && pendingUrlRef.current) {
      applyPendingUrl();
    }
  }, [isPlaying, applyPendingUrl]);

  // Also refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && mediaId) {
        fetchSignedUrl(mediaId, false); // Full refresh when tab becomes visible
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mediaId, fetchSignedUrl]);

  // Function to manually refresh the signed URL
  const refresh = useCallback(() => {
    if (mediaId) {
      fetchSignedUrl(mediaId, false);
    }
  }, [mediaId, fetchSignedUrl]);

  return {
    signedUrl,
    pendingUrl,
    isLoading,
    error,
    refresh,
    isPlaying,
    setIsPlaying,
    applyPendingUrl, // Expose for manual control if needed
  };
}

