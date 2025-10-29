import { BadRequestException, ValidationPipe, ValidationPipeOptions } from "@nestjs/common";

export const ValidationErrorsPipe = (options: ValidationPipeOptions = {}) => {
  return new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    forbidUnknownValues: true,
    validateCustomDecorators: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new BadRequestException(errors),
    ...options,
  });
};