import { API_BASE_URL } from "../../apiconfig";

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
      return `${API_BASE_URL}/master/secure-documents?path=${encodeURIComponent(decodeURIComponent(docMatch[1]))}`;
    }
    return encodeURI(trimmed);
  }

  const cleanPath = trimmed.replace(/^\/+/, "");
  // Local frontend assets stored in public/assets/...
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }

  // Backend uploaded file path - route via local backend proxy
  return `${API_BASE_URL}/master/secure-documents?path=${encodeURIComponent(cleanPath)}`;
}

export const DEFAULT_COURSE_FALLBACK = "/assets/landingpage/courses/course1.jpg";

/**
 * Normalizes course badge / hero image URLs so local assets, full external URLs,
 * and backend secure-documents paths load reliably without 404s.
 */
export function getCourseImageUrl(imagePath, fallback = DEFAULT_COURSE_FALLBACK) {
  if (!imagePath || typeof imagePath !== "string") {
    return fallback;
  }
  const trimmed = imagePath.trim();
  if (!trimmed) {
    return fallback;
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, "");
  // Local frontend assets in public/assets/...
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }
  // Path already prefixed with master/secure-documents
  if (cleanPath.startsWith("master/secure-documents")) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  // Backend uploaded file path
  return `${API_BASE_URL}/master/secure-documents?path=${encodeURIComponent(cleanPath)}`;
}

export function getLiveDocumentUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return DEFAULT_COURSE_FALLBACK;
  const cleanPath = imagePath.trim().replace(/^\/+/, "");
  return `${API_BASE_URL}/master/secure-documents?path=${encodeURIComponent(cleanPath)}`;
}

