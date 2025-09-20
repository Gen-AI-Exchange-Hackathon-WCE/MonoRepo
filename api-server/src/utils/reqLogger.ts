import pino from "pino";
import type { Request, Response, NextFunction } from "express";
import pinoHttp, { Options as PinoHttpOptions } from "pino-http";
import type { IncomingMessage, ServerResponse } from "http";
// import fs from "fs";
// import path from "path";
// import config from "./config"; // if needed later

// const logFilePath = path.join(__dirname, "logs/app.log");
// const logStream = pino.destination(logFilePath);

/**
 * Logger function for custom logs
 * Currently logs to console only, with prettified output
 */
// Pretty console logger
export const logger = pino({
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname,level",
    },
  },
});

export const loggerMiddleware = pinoHttp({
  logger,
  customLogLevel(res, err) {
    if ((res.statusCode ?? 0) >= 500 || err) return "error";
    if ((res.statusCode ?? 0) >= 400) return "warn";
    return "info";
  },
  customSuccessMessage(req, res) {
    return "request completed";
  },
  serializers: {
    // only basic shape here — real logging moved below
    req(req: IncomingMessage) {
      return {
        method: req.method,
        url: req.url,
      };
    },
    res(res: ServerResponse) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
  // This part enables us to log manually after body is parsed
  quietReqLogger: true, // 🔥 disables default req logging
});

// 🧠 Separate middleware to log full body manually AFTER parsing

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldSend = res.send;

  let responseBody: any = null;

  res.send = function (body) {
    try {
      responseBody = typeof body === "string" ? JSON.parse(body) : body;
    } catch (e) {
      responseBody = body;
    }
    return oldSend.call(res, body);
  };

  res.on("finish", () => {
    const { method, url, query, params, body } = req;
    logger.info({
      msg: "request completed",
      req: {
        method,
        url,
        query,
        params,
        ...(method !== "GET" && method !== "HEAD" && body ? { body } : {}),
      },
      res: {
        statusCode: res.statusCode,
        ...(responseBody ? { body: responseBody } : {}),
      },
    });
  });
  next();
};
