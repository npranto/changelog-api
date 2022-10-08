import jwt from "jsonwebtoken";
import config from "../config";
const bcrypt = require("bcrypt");

export const comparePassword = (plainTextPassword, hash) => {
  return bcrypt.compare(plainTextPassword, hash);
};

export const hashPassword = (plainTextPassword) => {
  const SALT_ROUNDS = 10;
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
};

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET
  );
  return token;
};

export const gracefulPromiseHandler = async (promise) =>
  promise
    .then((data) => Promise.resolve([null, data]))
    .catch((error) => Promise.resolve([error, null]));
