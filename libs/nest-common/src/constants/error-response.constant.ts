import { HttpStatus } from '@nestjs/common';
import { CommonErrorResponseDto } from '../dtos';

export const ERROR_RESPONSE = {
  NOT_FOUND: (resource: string): CommonErrorResponseDto => ({
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: `${resource.trim().toLowerCase().replace(/\s+/g, '_')}_not_found`,
    message: `${resource} not found`,
  }),
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
  TRANSACTION_NOT_BALANCED: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'transaction_not_balanced',
    message:
      'Transaction is not balanced: total debits must equal total credits',
  },
  TRANSACTION_INVALID_ENTRIES: {
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errorCode: 'transaction_invalid_entries',
    message: 'Transaction must have at least two entries',
  },
};
