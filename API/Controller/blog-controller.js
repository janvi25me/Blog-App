import fs from "fs";
import mongoose from "mongoose";
import Blog from "../Model/blog.js";
import User from "../Model/User.js";

export const getBlogById = async (req, res) => {
  const blogId = req.params.bid;
  // console.log("Blog id", blogId);
  let blog;
  try {
    if (mongoose.Types.ObjectId.isValid(blogId)) {
      blog = await Blog.findById(blogId);
    } else {
      blog = await Blog.findOne({ slug: blogId });
    }
  } catch (err) {
    console.log("Not able to get data followed by the id", err);
    return res.status(500).json({ message: "Cannot get data by provided id" });
  }
  if (!blog) {
    return res.json({ message: "Couldnot find blog for the provided id" });
  }
  return res.status(201).json({ blog });
};

export const getBlogByUserId = async (req, res) => {
  let userId = req.params.uid;
  // console.log("uid", userId);
  let userWithBlogs;
  try {
    userWithBlogs = await User.findById(userId).populate("blogs");
    if (!userWithBlogs || userWithBlogs.blogs.length === 0) {
      return res
        .status(404)
        .json("Couldnot find blogs for the provided user id");
    }
    return res.json({ blogs: userWithBlogs.blogs });
    // console.log("**", userWithBlogs);
  } catch (err) {
    console.error("Error fetching user blogs:", err);
    return res
      .status(500)
      .json("Fetching blogs failed, please try again later!");
  }
};

export const createBlog = async (req, res) => {
  const creator = req.userData.userId;
  const { id, user, title, body, createdAt, tag } = req.body;

  // console.log(req.body);

  if (!id || !user || !title || !body || !createdAt || !tag) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const createdBlog = new Blog({
    id,
    user,
    title,
    body,
    createdAt,
    tag,
    image: req.file.path,
    creator: creator,
  });

  let person;
  try {
    person = await User.findById(creator);
  } catch (err) {
    return res.status(400).json({ message: "Creating blog failed" });
  }

  if (!person) {
    return res
      .status(404)
      .json({ message: "User not found for the provided ID" });
  }

  try {
    await createdBlog.save();
  } catch (err) {
    console.log("Cannot create a blog, try again", err);
    return res.status(500).json({ message: "Please try again" });
  }

  try {
    person.blogs.push(createdBlog._id);
    await person.save();
  } catch (err) {
    console.log("Failed to add blog to user", err);
    return res.status(500).json({ message: "Failed to add blog to user" });
  }

  return res.status(200).json({ createdBlog });
};

export const getBlogAll = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    // console.log(">", blogs);
    return res.status(201).json({ blogs });
  } catch (err) {
    console.log("Not able to get data", err);
    return res.status(500).json({ message: "Cannot get data" });
  }
};

export const updateBlog = async (req, res) => {
  const { title, body, tag } = req.body;
  // console.log(req.body);
  const blogId = req.params.bid;

  const userId = req.userData.userId;
  // console.log("UserId:", userId, "BlogId:", blogId);
  let blog;
  try {
    blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Could not update" });
  }

  if (blog.creator.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "You are not allowed to edit this place" });
  }

  blog.title = title;
  blog.body = body;
  blog.tag = tag;
  try {
    await blog.save();
    // console.log("Blog updated", blog);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ Data: blog });
};

export const deleteBlog = async (req, res) => {
  const blogId = req.params.bid;
  let blog;
  try {
    blog = await Blog.findById(blogId).populate("creator");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    // console.log(blog);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong, could not find the blog id" });
  }

  const imagePath = blog.image;

  if (blog.creator.id !== req.userData.userId) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this blog" });
  }

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("Error deleting image:", err);
      return res.status(500).json({ message: "Error deleting image file" });
    }
  });

  try {
    await blog.deleteOne();
    await blog.creator.blogs.pull(blog);
    await blog.creator.save();
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, try again later" });
  }
};
