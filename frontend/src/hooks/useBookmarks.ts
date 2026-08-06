"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "hirescope-bookmarks";

// Manages bookmarked job IDs using browser localStorage
export function useBookmarks() {
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Loads saved bookmark IDs when the component first mounts
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEY);

    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);

        if (Array.isArray(parsedBookmarks)) {
          setBookmarkedJobIds(parsedBookmarks);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsLoaded(true);
  }, []);

  // Saves bookmark IDs whenever the bookmark list changes
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(bookmarkedJobIds)
    );
  }, [bookmarkedJobIds, isLoaded]);

  // Checks whether one job is currently bookmarked
  const isBookmarked = (jobId: number) => {
    return bookmarkedJobIds.includes(jobId);
  };

  // Adds or removes one job from bookmarks
  const toggleBookmark = (jobId: number) => {
    setBookmarkedJobIds((currentIds) =>
      currentIds.includes(jobId)
        ? currentIds.filter((id) => id !== jobId)
        : [...currentIds, jobId]
    );
  };

  return {
    bookmarkedJobIds,
    isBookmarked,
    toggleBookmark,
    isLoaded,
  };
}