import { API_BASE_URL } from "../../apiconfig";

export const DEFAULT_BLOG_FALLBACK = "/assets/landingpage/blog1_image.png";

/**
 * Normalizes blog and article image URLs so local frontend assets
 * and remote backend documents load properly without placeholder errors.
 */
export function getBlogImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") {
    return DEFAULT_BLOG_FALLBACK;
  }
  const trimmed = imagePath.trim();
  if (!trimmed) {
    return DEFAULT_BLOG_FALLBACK;
  }
  // Full external URL
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  // Data URI
  if (trimmed.startsWith("data:")) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, "");
  // Local frontend assets stored in public/assets/...
  if (cleanPath.startsWith("assets/")) {
    return `/${cleanPath}`;
  }
  // Backend uploaded file path
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
    const base = (API_BASE_URL || "").replace(/\/+$/, "");
    return `${base}/${cleanPath}`;
  }
  // Backend uploaded file path
  // If running on local development (127.0.0.1 / localhost) and loading uploaded documents,
  // we can use local API or fallback to live media host where files are stored
  const base = (API_BASE_URL || "").replace(/\/+$/, "");
  return `${base}/master/secure-documents?path=${encodeURIComponent(cleanPath)}`;
}

export function getLiveDocumentUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return DEFAULT_COURSE_FALLBACK;
  const cleanPath = imagePath.trim().replace(/^\/+/, "");
  return `https://knowledgeadmin.scholaracad.com/master/secure-documents?path=${encodeURIComponent(cleanPath)}`;
}

