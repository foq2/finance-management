import { HttpStatus } from '@nestjs/common';

export const ERROR_RESPONSE = {
  INTERNAL_SERVER_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'internal_server_error',
    message: 'Internal Server Error',
  },
  REQUEST_PAYLOAD_VALIDATION_ERROR: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'request_payload_validation_error',
    message: 'Request payload validation error',
  },
  INVALID_CREDENTIALS: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'invalid_credentials',
    message: 'Invalid credentials',
  },
  UNAUTHORIZED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    errorCode: 'unauthorized',
    message: 'Unauthorized',
  },
  USER_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'user_already_exists',
    message: 'User already exists',
  },
};
