// import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import blogsRoute from "./Router/blogsRoute.js";
import userRoute from "./Router/userRoute.js";
import "./db.js";

const app = express();

dotenv.config();

app.use(bodyParser.json());

app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use((err, req, res, next) => {
  console.log("Error occurred:", err);

  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.log("File unlink error:", unlinkErr);
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.code || 500).json({
    message: err.message || "An unknown error occurred",
  });
});

app.use("/api/blogs", blogsRoute);

app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("Server is running correctly");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
