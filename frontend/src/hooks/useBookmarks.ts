"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hirescope-bookmarks";
const BOOKMARK_EVENT = "hirescope-bookmarks-updated";

// Reads and validates bookmarked job IDs from localStorage
function readBookmarks(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedBookmarks = window.localStorage.getItem(STORAGE_KEY);

  if (!savedBookmarks) {
    return [];
  }

  try {
    const parsedBookmarks: unknown = JSON.parse(savedBookmarks);

    if (!Array.isArray(parsedBookmarks)) {
      return [];
    }

    // Keeps only valid numeric job IDs and removes duplicates
    return Array.from(
      new Set(
        parsedBookmarks.filter(
          (jobId): jobId is number =>
            typeof jobId === "number" && Number.isFinite(jobId)
        )
      )
    );
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// Saves bookmarked job IDs and notifies every bookmark component
function writeBookmarks(bookmarkIds: number[]) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(bookmarkIds)
  );

  // Updates other useBookmarks instances in the current browser tab
  window.dispatchEvent(new Event(BOOKMARK_EVENT));
}

// Manages bookmarked job IDs using browser localStorage
export function useBookmarks() {
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reloads bookmark data from localStorage
  const syncBookmarks = useCallback(() => {
    setBookmarkedJobIds(readBookmarks());
  }, []);

  useEffect(() => {
    // Loads saved bookmarks after the browser component mounts
    syncBookmarks();
    setIsLoaded(true);

    // Handles updates created in the current browser tab
    window.addEventListener(BOOKMARK_EVENT, syncBookmarks);

    // Handles updates created from another browser tab
    window.addEventListener("storage", syncBookmarks);

    return () => {
      window.removeEventListener(BOOKMARK_EVENT, syncBookmarks);
      window.removeEventListener("storage", syncBookmarks);
    };
  }, [syncBookmarks]);

  // Checks whether one job is currently bookmarked
  const isBookmarked = useCallback(
    (jobId: number) => bookmarkedJobIds.includes(jobId),
    [bookmarkedJobIds]
  );

  // Adds or removes one job and synchronizes every bookmark component
  const toggleBookmark = useCallback((jobId: number) => {
    const currentBookmarks = readBookmarks();

    const updatedBookmarks = currentBookmarks.includes(jobId)
      ? currentBookmarks.filter((id) => id !== jobId)
      : [...currentBookmarks, jobId];

    writeBookmarks(updatedBookmarks);
  }, []);

  return {
    bookmarkedJobIds,
    isBookmarked,
    toggleBookmark,
    isLoaded,
  };
}