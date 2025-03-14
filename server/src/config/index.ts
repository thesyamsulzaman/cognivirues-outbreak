import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "development";

let envConfig;

if (stage === "production") {
  envConfig = require("./production").default;
} else {
  envConfig = require("./development").default;
}

export default merge(
  {
    stage,
    env: process.env.NODE_ENV,
    port: 3001,
    secrets: {
      jwt: process.env.JWT_SECRET_KEY,
      dbUrl: process.env.DATABASE_URL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  envConfig
);
