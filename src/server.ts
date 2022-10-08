import express from "express";
import router from "./router";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { handleRequestBodyErrors, validateUser } from "./modules/middleware";
import { createNewUser, signIn } from "./handlers/user";
import { body } from "express-validator";
import config from "./config";

// initialize app
const app = express();

// constants
const PORT = 3000;

// middleware(s)
app.use(compression());
// secures app by setting various HTTP headers.
app.use(helmet());
// transfers cookies with client requests
app.use(cookieParser());
app.use(cors()); // allows any client to access any routes
app.use(morgan("dev")); // logs info for each request
app.use(express.json()); // allows passing JSON from client
// converts query params passed from client to object
app.use(express.urlencoded({ extended: true }));

// setup routes
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Welcome to Changelog API!",
  });
});
// user routes
app.post(
  "/sign-in",
  body("username").exists().isString(),
  body("password").exists().isString(),
  handleRequestBodyErrors,
  signIn
);
app.post(
  "/create-account",
  body("username").exists().isString(),
  body("password").exists().isString(),
  handleRequestBodyErrors,
  createNewUser
);
app.get("/error", async (req, res) => {
  const secret = await new Promise((resolve) => {
    setTimeout(() => {
      resolve("secret");
    }, 2000);
  });
  return res.status(200).json({ secret });
});

// API routes
app.use("/api", validateUser, router);

// error handler
app.use((err, req, res) => {
  console.log(err);
  const { type } = err;

  if (type === "auth") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (type === "input") {
    return res.status(400).json({ message: "Invalid input" });
  }
  return res.status(500).json({ message: "Oops! Something went wrong :(" });
});

// listen
app.listen(config.port, () => {
  console.log(`Listening to PORT ${config.port} on ${config.env}`);
});
