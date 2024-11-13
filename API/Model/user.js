import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog" }],
});

const User = mongoose.model("User", userSchema);

export default User;
