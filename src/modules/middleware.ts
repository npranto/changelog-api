import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "../config";

export const validateUser = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({
      message:
        "Not authorized to use Changelog API. Please sign in or create a new account to get a token first",
    });
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    return res.status(401).json({
      message: "No token passed to auth header",
    });
  }

  try {
    const user = jwt.verify(token, config.secret.jwt);
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid token passed to auth header",
    });
  }
};

export const handleRequestBodyErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};
