export class ApiError extends Error {
  status: number;
  details?: unknown;
  code?: string;

  constructor(message: string, status = 500, details?: unknown, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Server error";
}
