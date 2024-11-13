import express from "express";
import { getAllUsers, login, signup } from "../Controller/user-controller.js";

const router = express.Router();

router.get("/all", getAllUsers);

router.post("/signup", signup);

router.post("/login", login);

export default router;
