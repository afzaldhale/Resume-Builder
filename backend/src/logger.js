import fs from "fs";
import path from "path";
import { backendRoot } from "./env.js";

const logsDir = path.join(backendRoot, "logs");
fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});
const appLogStream = fs.createWriteStream(path.join(logsDir, "app.log"), {
  flags: "a",
});
const errorLogStream = fs.createWriteStream(path.join(logsDir, "error.log"), {
  flags: "a",
});

const toSerializable = (value) => {
  if (value instanceof Error) {
    return {
      message: value.message,
      stack: value.stack,
      name: value.name,
    };
  }

  if (Array.isArray(value)) {
    return value.map((entry) => toSerializable(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toSerializable(entry)])
    );
  }

  return value;
};

const writeLine = (stream, level, message, meta = undefined) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
  };

  if (meta !== undefined) {
    payload.meta = toSerializable(meta);
  }

  stream.write(`${JSON.stringify(payload)}\n`);
};

const logToConsole = (level, message, meta = undefined) => {
  const consoleMethod =
    level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (meta === undefined) {
    consoleMethod(message);
    return;
  }

  consoleMethod(message, toSerializable(meta));
};

export const logger = {
  info(message, meta) {
    writeLine(appLogStream, "info", message, meta);
    logToConsole("info", message, meta);
  },
  warn(message, meta) {
    writeLine(appLogStream, "warn", message, meta);
    logToConsole("warn", message, meta);
  },
  error(message, meta) {
    writeLine(appLogStream, "error", message, meta);
    writeLine(errorLogStream, "error", message, meta);
    logToConsole("error", message, meta);
  },
};

export const requestLogger = (req, res, next) => {
  const startTime = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;

    writeLine(accessLogStream, "info", "HTTP request", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });

  next();
};
