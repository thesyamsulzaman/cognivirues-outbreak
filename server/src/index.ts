import * as dotenv from "dotenv";
import express, { Express } from "express";
// import morgan from "morgan";
// import { protect } from "./utils/auth";
// import router from "./router";
// import cors from "cors";

// import https from "https";
// // import http from "http";
// import { readFileSync } from "fs";
// import path from "path";
// import helmet from "helmet";
// import cookieSession from "cookie-session";
// import prismaClient from "./libs/db";
// import { getPlayerProfile } from "./handlers/player";
// import playerRouter from "./routes/player";

dotenv.config();
const app: Express = express();
// const maxRetries = 5;

// const options = {
//   key: readFileSync(path.join(process.cwd(), "key.pem"), "utf-8"),
//   cert: readFileSync(path.join(process.cwd(), "cert.pem"), "utf-8"),
// };

// app.use(helmet());
// app.use(cors());
// app.use(
//   cookieSession({
//     name: process.env.COOKIE_NAME,
//     maxAge: 60 * 60 * 24 * 1000,
//     keys: [
//       process.env.COOKIE_SECRET_KEY,
//       process.env.COOKIE_SECRET_ROTATION_KEY,
//     ],
//   })
// );

// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (_, res) => {
//   res.json({ title: "Cognivirues Outbreak (v1)" });
// });

// app.use("/api", protect(), router);
// app.use("/auth", playerRouter);
// app.get("/api/profile", protect(), getPlayerProfile);

// app.use((err, req, res, next) => {
//   console.log("error type", err);

//   if (err?.type === "auth") {
//     return res.status(401).json({ message: "Unauthorized" });
//   } else if (err.type === "input") {
//     return res.status(401).json({ message: "Invalid Input" });
//   } else {
//     res.status(500).json({ message: "There's someting wrong" });
//   }
// });

// (async function connectWithRetry(retries = 0) {
//   try {
//     await prismaClient.$connect();
//     console.log("Connected to the database");
//   } catch (error) {
//     if (retries < maxRetries) {
//       console.log(`Retrying to connect... (${retries + 1})`);
//       setTimeout(() => connectWithRetry(retries + 1), 2000);
//     } else {
//       console.error("Failed to connect to the database", error);
//       process.exit(1);
//     }
//   }
// })();

// if (process.env.NODE_ENV !== "test") {
//   https.createServer(options, app).listen(process.env.PORT, () => {
//     console.log(`[Server] Listening to port ${process.env.PORT}`);
//   });
// }

export default app;
