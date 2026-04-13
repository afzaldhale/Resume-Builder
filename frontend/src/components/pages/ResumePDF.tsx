import axios, { AxiosError } from "axios";

/**
 * =========================
 * AXIOS INSTANCE
 * =========================
 * - Used for ALL JSON APIs
 * - Cookies / sessions supported
 */
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * =========================
 * RESPONSE INTERCEPTOR
 * =========================
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("No response from server:", error.message);
    } else {
      console.error("Axios error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

/**
 * =========================
 * PDF DOWNLOAD HELPER
 * =========================
 * IMPORTANT:
 * - DO NOT use main `api` instance for blobs
 * - Browsers require separate config
 */
export const downloadResumePDF = async (resumeId: number) => {
  const response = await axios.get(
    `http://localhost:8000/api/resumes/${resumeId}/pdf`,
    {
      responseType: "blob", // 🔴 REQUIRED
      withCredentials: true,
    }
  );

  const blob = new Blob([response.data], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `resume-${resumeId}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
