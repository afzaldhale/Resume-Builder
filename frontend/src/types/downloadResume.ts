export const downloadResumePDF = async () => {
  const element = document.getElementById("resume-preview");

  if (!element) {
    alert("Resume preview not found");
    return;
  }

  const html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        ${element.outerHTML}
      </body>
    </html>
  `;

  const res = await fetch("http://localhost:5000/api/resume/download-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html }),
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "resume.pdf";
  a.click();
};
