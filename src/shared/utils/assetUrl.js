export const assetUrl = (path = "") => {
  if (!path || typeof path !== "string") return path;

  if (/^(https?:|mailto:|tel:|data:|blob:)/i.test(path) || path.startsWith("//")) {
    return path;
  }

  if (!path.startsWith("/")) return path;

  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\/+/, "")}`;
};