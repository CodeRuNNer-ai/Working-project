import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transcriptRoutes from "./routes/transcriptRoutes.js";

dotenv.config();

// 🔹 Connect Database
connectDB();

const app = express();

// 🔹 Middlewares
app.use(express.json({ limit: "50mb" }));                        // ✅ increased limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));  // ✅ increased limit
app.use(cors());

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/transcript", transcriptRoutes);

// 🔹 Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔹 Function to Print All Routes (Safe & Clean)
const printRoutes = (stack, basePath = "") => {
  stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");

      console.log(`ROUTE: [${methods}] ${basePath}${middleware.route.path}`);
    } else if (middleware.name === "router" && middleware.handle.stack) {
      printRoutes(middleware.handle.stack, basePath);
    }
  });
};

// 🔹 Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // ✅ Safely print routes AFTER server starts
  if (app._router && app._router.stack) {
    console.log("\n📌 Available Routes:");
    printRoutes(app._router.stack);
  } else {
    console.log("⚠️ No routes found");
  }
});