export interface TimeResult {
  time: number;
  timeUnit: "days" | "hours" | "minutes";
}

export function getTime(minute: number): TimeResult {
  const hours = Math.floor(minute / 60);
  const days = Math.floor(hours / 24);

  const time = days || hours || minute;
  const unitIndex = [days, hours, minute].lastIndexOf(time);
  const timeUnit = ["days", "hours", "minutes"][
    unitIndex
  ] as TimeResult["timeUnit"];

  return { time, timeUnit };
}

export function extractRecipeId(uri: string): string {
  return uri.slice(uri.lastIndexOf("_") + 1);
}

import type { EdamamImages } from "@/lib/types";

type ImageInfo = { url: string; width: number; height: number };

export function getBestImage(images: EdamamImages | undefined): ImageInfo {
  if (!images) return { url: "", width: 0, height: 0 };
  return (
    images.LARGE ??
    images.REGULAR ??
    images.SMALL ??
    images.THUMBNAIL ?? { url: "", width: 0, height: 0 }
  );
}
