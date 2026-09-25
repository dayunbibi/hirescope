"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "hirescope-bookmarks";
const BOOKMARK_EVENT = "hirescope-bookmarks-updated";

// Parses and validates bookmarked job IDs from the raw localStorage value
function parseBookmarks(savedBookmarks: string | null): number[] {
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
    return [];
  }
}

// Reads bookmarks from localStorage and clears the key if it is corrupted
function readBookmarks(): number[] {
  const savedBookmarks = window.localStorage.getItem(STORAGE_KEY);
  const bookmarks = parseBookmarks(savedBookmarks);

  if (savedBookmarks && bookmarks.length === 0) {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return bookmarks;
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

// Subscribes to updates from this tab (custom event) and other tabs (storage event)
function subscribe(onChange: () => void) {
  window.addEventListener(BOOKMARK_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(BOOKMARK_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// The raw string is a stable snapshot; "" means loaded with nothing saved
function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

// null on the server and during hydration, so bookmarks count as not loaded yet
function getServerSnapshot() {
  return null;
}

// Manages bookmarked job IDs using browser localStorage
export function useBookmarks() {
  const savedBookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLoaded = savedBookmarks !== null;
  const bookmarkedJobIds = useMemo(() => parseBookmarks(savedBookmarks), [savedBookmarks]);

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