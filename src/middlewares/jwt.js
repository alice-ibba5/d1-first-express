import jwt from "jsonwebtoken";
import { Author } from "../models/authors.js";

const checkJwt = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.author = await Author.findById(payload.id).select("-password");

    if (!req.author) {
      return res.status(404).json({ message: "Author not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default checkJwt;
