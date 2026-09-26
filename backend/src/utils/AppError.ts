export enum ErrorType {
  VALIDATION = "VALIDATION",
  AUTH = "AUTH",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  FORBIDDEN = "FORBIDDEN",
  UNAUTHORIZED = "UNAUTHORIZED",
  DATABASE = "DATABASE",
  INTERNAL = "INTERNAL",
  BAD_REQUEST = "BAD_REQUEST",
}

export interface ErrorMetadata {
  [key: string]: any;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;
  public readonly type: ErrorType;
  public readonly metadata: ErrorMetadata;
  public readonly timestamp: Date;
  public readonly code: string;

  constructor(
    message: string,
    statusCode: number,
    type: ErrorType = ErrorType.INTERNAL,
    metadata: ErrorMetadata = {},
    code?: string
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.type = type;
    this.metadata = metadata;
    this.timestamp = new Date();
    this.code = code ? code : type;

    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message = "Bad request", code = "BAD_REQUEST", metadata: ErrorMetadata = {}): AppError {
    return new AppError(message, 400, ErrorType.BAD_REQUEST, metadata, code);
  }

  static unauthorized(message = "Unauthorized", code = "UNAUTHORIZED", metadata: ErrorMetadata = {}): AppError {
    return new AppError(message, 401, ErrorType.UNAUTHORIZED, metadata, code);
  }

  static forbidden(message = "Forbidden", code = "FORBIDDEN", metadata: ErrorMetadata = {}): AppError {
    return new AppError(message, 403, ErrorType.FORBIDDEN, metadata, code);
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND", metadata: ErrorMetadata = {}): AppError {
    return new AppError(message, 404, ErrorType.NOT_FOUND, metadata, code);
  }

  static internal(message = "Internal server error", code = "INTERNAL_ERROR", metadata: ErrorMetadata = {}): AppError {
    return new AppError(message, 500, ErrorType.INTERNAL, metadata, code);
  }
}
