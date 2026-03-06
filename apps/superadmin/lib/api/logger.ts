import { getErrorMessage } from "@/lib/api/error";

export const logger = {
  info(message: string, data?: unknown) {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        data: data ?? null,
        timestamp: new Date().toISOString()
      })
    );
  },
  warn(message: string, data?: unknown) {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        data: data ?? null,
        timestamp: new Date().toISOString()
      })
    );
  },
  error(message: string, error?: unknown) {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error ? getErrorMessage(error) : null,
        timestamp: new Date().toISOString()
      })
    );
  }
};
