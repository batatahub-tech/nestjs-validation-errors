# @batatahub.com/nestjs-validation-errors

A simple NestJS filter that formats validation errors in a consistent structure.

## Installation

```bash
npm install @batatahub.com/nestjs-validation-errors
```

## Peer Dependencies

This package requires the following peer dependencies:

- `@nestjs/core` (^10.0.0 || ^11.0.0)
- `@nestjs/common` (^10.0.0 || ^11.0.0)
- `class-validator` (^0.14.0)
- `"class-transformer` (^0.5.1)

## Usage

### 1. Register globally in your main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationErrorsFilter, ValidationErrorsPipe } from '@batatahub/nestjs-validation-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Activate validation error formatting globally
  app.useGlobalPipes(ValidationErrorsPipe({}));
  app.useGlobalFilters(new ValidationErrorsFilter());
  
  await app.listen(3000);
}
bootstrap();
```

### 2. Alternative: Use the ValidationErrorsPipe in specific routes

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ValidationErrorsPipe } from '@batatahub/nestjs-validation-errors';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body(ValidationErrorsPipe()) createUserDto: CreateUserDto) {
    // Your logic here
  }
}
```

### 3. Define your DTOs with class-validator decorators

```typescript
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
```

## Response Format

When validation fails, the filter will return a consistent error structure:

```json
{
  "status_code": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "email": ["email must be an email"],
    "password": ["password must be longer than or equal to 6 characters"]
  }
}
```

## Features

- **Consistent Error Format**: All validation errors follow the same structure
- **Nested Object Support**: Handles nested validation errors with dot notation
- **TypeScript Support**: Full TypeScript definitions included
- **Zero Configuration**: Works out of the box with sensible defaults

## License

MIT

## Author

Batata Hub <tech@batatahub.com> (https://batatahub.com)
