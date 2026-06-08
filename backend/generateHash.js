import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("adminPass@123", 10);
  // Output intentionally suppressed in production scripts; print only when explicitly requested
  if (process.env.DEBUG_HASH_OUTPUT === 'true') {
    console.log("Hash:", hash);
  }
};

run();
