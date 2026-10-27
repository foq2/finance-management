import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ERROR_RESPONSE } from '../constants';
import { AppException } from '../exceptions';

function formatValidationErrors(
  errors: ValidationError[],
): Record<string, any> {
  const formattedErrors: Record<string, any> = {};

  for (const error of errors) {
    const { property, constraints, children } = error;

    if (constraints) {
      formattedErrors[property] = Object.values(constraints).join(', ');
    } else if (children && children.length > 0) {
      formattedErrors[property] = formatValidationErrors(children);
    }
  }

  return formattedErrors;
}

function classValidatorExceptionFactory(errors: ValidationError[]) {
  const details = formatValidationErrors(errors);
  const failedProperties = errors.map((e) => e.property).join(', ');

  const exceptionResponse = {
    ...ERROR_RESPONSE.REQUEST_PAYLOAD_VALIDATION_ERROR,
    message: `ValidateFailed: ${failedProperties}`,
    details,
  };

  return new AppException(exceptionResponse);
}

export class PayloadValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: classValidatorExceptionFactory,
    });
  }
}
