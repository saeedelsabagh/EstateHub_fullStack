
import { API_BASE_URL } from "../api/axios";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder-property.jpg";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};
