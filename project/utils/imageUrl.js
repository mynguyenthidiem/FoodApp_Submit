import { API_ORIGIN } from "../api/client";

export function resolveImage(
  image,
  fallback = require("../assets/banner.jpg")
) {
  if (!image) return fallback;

  if (typeof image === "number") {
    return image;
  }

  if (typeof image === "string") {
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return { uri: image };
    }

    const path = image.startsWith("/")
      ? image
      : `/${image}`;

    return {
      uri: `${API_ORIGIN}${path}`,
    };
  }

  return fallback;
}