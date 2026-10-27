import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonLogger } from '../logger';
import { CommonErrorResponseDto } from '../dtos';
import { throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: CommonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const isHttpException = exception instanceof HttpException;
    const microserviceName = this.configService.get<string>(
      'app.microserviceName',
    );

    const statusCode = isHttpException
      ? exception.getStatus()
      : (exception as any)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    let exceptionRes = isHttpException
      ? exception.getResponse()
      : (exception as any);

    if (typeof exceptionRes === 'string') {
      exceptionRes = { message: exceptionRes };
    }

    const errorPayload: Partial<CommonErrorResponseDto> = {
      statusCode,
      timestamps: new Date().toISOString(),
      errorService: microserviceName,
      message: exceptionRes?.message || 'Internal Server Error',
      errorCode: exceptionRes?.errorCode || 'Internal Server Error',
      ...exceptionRes,
    };

    this.logger.error({
      context: 'RpcExceptionFilter.catch',
      error: exception,
      message: errorPayload.message,
    });

    return throwError(() => errorPayload);
  }
}
