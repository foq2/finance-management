import { HttpException, HttpStatus } from '@nestjs/common';
import { CommonErrorResponseDto } from '../dtos';

export class AppException extends HttpException {
  constructor(error: CommonErrorResponseDto) {
    const status = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    super({ ...error }, status);
  }
}
