import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import { throwError } from 'rxjs';
import { CommonErrorResponseDto } from '../dtos';
import { CommonLogger } from '../logger';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
    private readonly logger: CommonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx?.getRequest();
    const res = ctx?.getResponse();
    const isHttpException = exception instanceof HttpException;
    const isRpcContext = host.getType() === 'rpc';
    const microserviceName = this.configService.get('app.microserviceName');

    const httpStatus = isHttpException
      ? exception.getStatus()
      : (exception as any)?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

    const errorData: Partial<CommonErrorResponseDto> = {
      statusCode: httpStatus,
      timestamps: new Date().toISOString(),
      path: req?.url,
    };

    if (isHttpException) {
      let exceptionRes = exception.getResponse();
      if (typeof exceptionRes === 'string') {
        exceptionRes = { message: exceptionRes };
      }

      _.assign(
        errorData,
        {
          statusCode: exception.getStatus(),
          errorService: microserviceName,
        },
        exceptionRes,
      );

      this.logger.error(`HttpException caught: ${exception?.message}`, {
        context: 'AllExceptionFilter.catch',
      });
    } else {
      // const errMessage = (exception as any)?.message || String(exception);
      // const errStack = (exception as any)?.stack || new Error().stack;
      this.logger.error(
        `A non-http error being throw somewhere, ${(exception as any)?.message}`,
        {
          error: (exception as any)?.stack,
          context: `AllExceptionFilter.catch`,
        },
      );

      const rpcError = exception as any;
      _.assign(errorData, {
        statusCode: rpcError?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: rpcError?.message,
        errorCode: rpcError?.errorCode,
        errorService: microserviceName,
        details: exception,
        // details: convertErrorToObject(exception),
      });
    }

    // ★ Attach the error to the request for use in middleware logging
    (res as any).error = exception;

    const isProductionEnv = this.configService.get('app.isProductionEnv');
    isProductionEnv && delete errorData.details;

    if (isRpcContext) return throwError(() => errorData);

    if (!res.headersSent) {
      httpAdapter.reply(ctx.getResponse(), errorData, httpStatus);
    } else {
      this.logger.warn('Response already sent, skipping error response', {
        url: req?.url,
        method: req?.method,
      });
    }
  }
}
