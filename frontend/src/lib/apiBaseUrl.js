const getBrowserApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:8000";
  }

  const { protocol, hostname } = window.location;
  return `${protocol}//${hostname}:8000`;
};

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || getBrowserApiBaseUrl();
