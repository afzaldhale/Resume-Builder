import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("AdminResumeBuilder@123", 10);
  console.log("Hash:", hash);
};

run();
