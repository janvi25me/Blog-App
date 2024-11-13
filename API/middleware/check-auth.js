import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  // console.log("Inside check auth middleware");
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;
  try {
    token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, "SECRETKEY");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
