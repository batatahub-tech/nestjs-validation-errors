import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { formatErrors } from '../utils/format-errors';

interface BadRequestValidationResponse {
  statusCode: number;
  message: ValidationError[] | string[];
  error: string;
}

function isValidationError(e: any): e is ValidationError {
  return e && typeof e === 'object' && 'property' in e;
}

@Catch(BadRequestException)
export class ValidationErrorsFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const res = exception.getResponse() as BadRequestValidationResponse | string;

    const maybeMessage = (typeof res === 'object' && res) ? (res as any).message : undefined;
    const isValidation = Array.isArray(maybeMessage) && maybeMessage.every(isValidationError);

    if (!isValidation) {
      return response.status(status).json(res);
    }

    const formattedErrors = formatErrors(maybeMessage as ValidationError[]);

    return response.status(status).json({
      status_code: status,
      error: (typeof res === 'object' && (res as any)?.error) || 'Bad Request',
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
}