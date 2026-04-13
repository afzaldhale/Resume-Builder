import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("adminPass@123", 10);
  console.log("Hash:", hash);
};

run();
