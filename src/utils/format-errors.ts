import { ValidationError } from "class-validator";

export type FormattedValidationErrors = Record<string, string[]>;

export function formatErrors(
  errors: ValidationError[],
  parentPath = '',
): FormattedValidationErrors {
  const result: FormattedValidationErrors = {};

  for (const error of errors) {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result[propertyPath] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatErrors(error.children, propertyPath);
      Object.assign(result, childErrors);
    }
  }

  return result;
}
