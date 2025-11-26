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
 * Reusable hook to fetch and manage signed URLs for media
 * Automatically fetches a new signed URL when mediaId changes
 * Auto-refreshes every 4 minutes to prevent expiration (URLs expire in 5 minutes)
 * Can be used for images, videos, PDFs, etc.
 */
export function useMediaUrl(mediaId: string | null | undefined) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSignedUrl = useCallback(async (id: string) => {
    if (!id) {
      setSignedUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use relative URL - Next.js API routes work on all subdomains
      const response = await fetch(`/api/v1/media/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch media" }));
        throw new Error(errorData.error || "Failed to fetch media");
      }

      const data: MediaUrlResponse = await response.json();
      
      if (data.data?.signedUrl) {
        setSignedUrl(data.data.signedUrl);
      } else {
        throw new Error("No signed URL in response");
      }
    } catch (err) {
      console.error("Error fetching media URL:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch media");
      setSignedUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when mediaId changes
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (mediaId) {
      // Initial fetch
      fetchSignedUrl(mediaId);

      // Set up auto-refresh every 4 minutes (240000ms) to stay ahead of 5-minute expiration
      refreshIntervalRef.current = setInterval(() => {
        fetchSignedUrl(mediaId);
      }, 4 * 60 * 1000); // 4 minutes
    } else {
      setSignedUrl(null);
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

  // Also refresh when page becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && mediaId) {
        fetchSignedUrl(mediaId);
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
      fetchSignedUrl(mediaId);
    }
  }, [mediaId, fetchSignedUrl]);

  return {
    signedUrl,
    isLoading,
    error,
    refresh,
  };
}

