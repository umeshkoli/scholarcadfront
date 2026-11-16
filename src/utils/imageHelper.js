import { API_BASE_URL } from "../../apiconfig.js";

const LIVE_MEDIA_FALLBACK = "https://knowledgeadmin.scholaracad.com";

export const DEFAULT_BLOG_FALLBACK = "/assets/landingpage/blog1_image.png";

/**
 * Normalizes blog and article image URLs so local frontend assets
 * and backend uploaded documents load properly with their unique images.
 */
export function getBlogImageUrl(item) {
  if (!item) {
    return DEFAULT_BLOG_FALLBACK;
  }

  // Extract raw path whether `item` is a blog/article object or a string path
  const rawInput =
    typeof item === "string"
      ? item
      : item.header_image ||
        item.image ||
        item.blog_image ||
        item.article_image ||
        item.image_url ||
        "";

  if (!rawInput || typeof rawInput !== "string") {
    return DEFAULT_BLOG_FALLBACK;
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return DEFAULT_BLOG_FALLBACK;
  }

  // Data URI
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Full URL: if it points to a /documents/... path from local or live backend
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const docMatch = trimmed.match(/\/(documents\/.+)$/i);
    if (docMatch && docMatch[1]) {
      return `${API_BASE_URL}/master/secure-documents?v=2&path=${encodeURIComponent(decodeURIComponent(docMatch[1]))}`;
    }
    return encodeURI(trimmed);
  }

  const cleanPath = trimmed.replace(/^\/+/, "");
  // Local frontend assets stored in public/assets/...
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }

  // Backend uploaded file path - route via local backend proxy
  return `${API_BASE_URL}/master/secure-documents?v=2&path=${encodeURIComponent(cleanPath)}`;
}

export const DEFAULT_COURSE_FALLBACK = "/assets/landingpage/courses/course1.jpg";

/**
 * Normalizes course badge / hero image URLs so local assets, full external URLs,
 * and backend secure-documents paths load reliably without 404s.
 */
export function getCourseImageUrl(item, fallback = DEFAULT_COURSE_FALLBACK) {
  if (!item) {
    return fallback;
  }

  // Support both course object and string imagePath
  const rawInput =
    typeof item === "string"
      ? item
      : item.image_url ||
        item.image ||
        item.header_image ||
        item.certificate_image ||
        "";

  if (!rawInput || typeof rawInput !== "string") {
    return fallback;
  }

  const trimmed = rawInput.trim();
  if (!trimmed) {
    return fallback;
  }

  // 1. Full URL (http://, https://) or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.replace(/^\/+/, "");

  // 2. Local frontend assets in public/assets/...
  if (
    cleanPath.startsWith("assets/landingpage/") ||
    cleanPath.startsWith("assets/banner-images/") ||
    cleanPath.startsWith("assets/icons/")
  ) {
    return `/${cleanPath}`;
  }

  const rawBackend = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

  // 3. Backend uploaded file path under documents/ (e.g. documents/Scholar Acad/Course/...)
  if (cleanPath.startsWith("documents/")) {
    // /documents/... is not served directly (404); use the secure-documents route via the proxy
    return `${API_BASE_URL}/master/secure-documents?v=2&path=${encodeURIComponent(cleanPath)}`;
  }

  // 4. Other assets paths
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }

  // 5. Explicit master/secure-documents
  if (cleanPath.startsWith("master/secure-documents")) {
    return `${rawBackend}/${cleanPath}`;
  }

  // 6. Default to backend master route
  return `${rawBackend}/master/secure-documents?v=2&path=${encodeURIComponent(cleanPath)}`;
}

export function getLiveDocumentUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return DEFAULT_COURSE_FALLBACK;
  const cleanPath = imagePath.trim().replace(/^\/+/, "");
  return `https://knowledgeadmin.scholaracad.com/master/secure-documents?v=2&path=${encodeURIComponent(cleanPath)}`;
}

