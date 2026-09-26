import { BaseResponse } from '../types';
import { AppError } from './AppError';

export class ResponseHelper {
  static success<T>(
    data?: T,
    message = 'Success',
    extraFields: Record<string, any> = {},
    statusCode = 200,
    code = 'SUCCESS'
  ): any {
    return {
      succeeded: true,
      success: true,
      message,
      msg: message,
      statusCode,
      code,
      data: data ?? null,
      errors: null,
      ...extraFields,
    };
  }

  static error(
    message: string,
    code = 'ERROR',
    statusCode = 500,
    errors: Record<string, string[]> | null = null
  ): any {
    return {
      succeeded: false,
      success: false,
      message,
      msg: message,
      statusCode,
      code,
      data: null,
      errors,
    };
  }

  static fromAppError(err: AppError): any {
    return {
      succeeded: false,
      success: false,
      message: err.message,
      msg: err.message,
      statusCode: err.statusCode,
      code: err.code,
      data: null,
      errors: err.metadata,
    };
  }
}
