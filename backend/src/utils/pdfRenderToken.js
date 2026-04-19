import jwt from "jsonwebtoken";

const PDF_RENDER_SCOPE = "resume-pdf-render";

export const createPdfRenderToken = ({
  resumeId,
  userId = null,
  role = "user",
}) =>
  jwt.sign(
    {
      scope: PDF_RENDER_SCOPE,
      resumeId: Number(resumeId),
      userId: userId ? Number(userId) : null,
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

export const verifyPdfRenderToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.scope !== PDF_RENDER_SCOPE) {
    throw new Error("Invalid PDF render token scope");
  }

  return decoded;
};
