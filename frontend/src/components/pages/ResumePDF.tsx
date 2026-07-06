import api from "@/api/axios";

export const downloadResumePDF = async (resumeId: number) => {
  const response = await api.get(`/api/resumes/${resumeId}/pdf`, {
    responseType: "blob",
  });

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

export default downloadResumePDF;
