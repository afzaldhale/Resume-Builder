import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { db } from "./database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected!");
});

// Routes
app.use("/auth", authRoutes);

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);