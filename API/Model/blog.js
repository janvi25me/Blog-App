import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  id: { type: String, required: true },
  user: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  tag: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
