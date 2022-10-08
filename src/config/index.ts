import merge from "lodash.merge";

// set NODE_ENV to one of the following:
// "production" || "testing" || "development"
const env = process.env.NODE_ENV || "development";

let envConfig;

if (env === "production") {
  envConfig = require("./prod").default;
} else if (env === "testing") {
  envConfig = require("./testing").default;
} else {
  envConfig = require("./local").default;
}

export default merge(
  {
    env,
    port: 3000,
    secret: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
    },
  },
  envConfig
);
