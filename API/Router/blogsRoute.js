import express from "express";
import {
  createBlog,
  deleteBlog,
  getBlogAll,
  getBlogById,
  getBlogByUserId,
  updateBlog,
} from "../Controller/blog-controller.js";
import fileUpload from "../middleware/file-upload.js";
import { checkAuth } from "../middleware/check-auth.js";

const router = express.Router();

router.get("/all", getBlogAll);

router.get("/:bid", getBlogById);

router.get("/user/:uid", getBlogByUserId); // http://localhost:3000/api/blogs/user/432424543425435345

router.post("/", checkAuth, fileUpload.single("image"), createBlog);

router.patch("/edit/:bid", checkAuth, updateBlog);

router.delete("/d/:bid", checkAuth, deleteBlog);

export default router;
