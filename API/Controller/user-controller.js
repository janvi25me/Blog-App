import User from "../Model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req, res) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Fetching users failed..." });
  }
  return res.status(200).json({ Data: users, message: "All Users" });
};

export const signup = async (req, res) => {
  const { user, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return res.status(500).json({ message: "Signing up failed, try again" });
  }

  if (existingUser) {
    return res
      .status(422)
      .json({ message: "User already exists, please login instead" });
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Could not create user, try again" });
  }

  const newUser = new User({
    user,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Cannot create user, try again" });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "SECRETKEY",
      { expiresIn: "6d" }
    );
  } catch (err) {
    console.error("Error creating token:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, try again later" });
  }

  res.status(200).json({
    message: "Sign up successful!",
    userId: newUser.id,
    email: newUser.email,
    token: token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      console.log("User not found for email:", email);
      return res
        .status(400)
        .json({ message: "Invalid credentials, could not log you in" });
    }
  } catch (err) {
    console.error("Error finding user:", err);
    return res.status(501).json({ message: "Logging in failed, try again" });
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
    if (!isValidPassword) {
      console.log("Invalid password for email:", email);
      return res
        .status(400)
        .json({ message: "Invalid credentials, could not log you in" });
    }
  } catch (err) {
    console.error("Error comparing passwords:", err);
    return res.status(501).json({
      message: "Could not log you in, check your credentials, and try again",
    });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "SECRETKEY",
      { expiresIn: "6d" }
    );
  } catch (err) {
    console.error("Error creating token:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, try again later" });
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};
