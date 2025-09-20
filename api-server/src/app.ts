import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import envConfig from "./config/env.config";
import { logger, requestLogger } from "./utils/reqLogger";
import { isAuthenticated } from "./middlewares/auth.middleware";
import healthRouter from "./routes/example.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import profileRouter from "./routes/profile.routes";
import productRouter from "./routes/product.routes";
import investorRouter from "./routes/investor.routes";
import courseRouter from "./routes/course.routes";

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (envConfig.CORS_ORIGIN.split(",").includes(origin ?? "") || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

if (envConfig.LOGGING) {
  // app.use(loggerMiddleware);
  logger.info("Logging is Enabled");
  app.use(requestLogger);
} else {
  logger.info("Logging is Disabled");
}

app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", isAuthenticated, userRouter);
app.use("/api/profile", isAuthenticated, profileRouter);
app.use("/api/product", isAuthenticated, productRouter);
app.use("/api/investor", isAuthenticated, investorRouter);
app.use("/api/course", isAuthenticated, courseRouter)

export default app;
