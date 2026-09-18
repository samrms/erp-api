import { BaseLogger } from "./BaseLogger.js";

export class Logger extends BaseLogger {
  info(obj) {
    console.log(
      JSON.stringify({ level: "info", ...obj, time: new Date().toISOString() }),
    );
  }
  error(obj) {
    console.error(
      JSON.stringify({
        level: "error",
        ...obj,
        time: new Date().toISOString(),
      }),
    );
  }
  warn(obj) {
    console.warn(
      JSON.stringify({ level: "warn", ...obj, time: new Date().toISOString() }),
    );
  }
}
