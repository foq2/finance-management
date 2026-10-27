import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { CommonLogger } from '../logger';
import { CommonErrorResponseDto } from '../dtos';
import _ from 'lodash';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService,
    private readonly logger: CommonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const isHttpException = exception instanceof HttpException;
    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const microserviceName = this.configService.get<string>(
      'app.microserviceName',
    );

    const errorData: Partial<CommonErrorResponseDto> = {
      statusCode: httpStatus,
      timestamps: new Date().toISOString(),
      path: req?.url,
    };

    if (isHttpException) {
      let resContent = exception.getResponse();
      if (typeof resContent === 'string') {
        resContent = { message: resContent };
      }

      _.assign(
        errorData,
        { statusCode: exception.getStatus(), errorService: microserviceName },
        resContent,
      );

      this.logger.error(`HttpException caught: ${exception?.message}`, {
        context: 'HttpExceptionFilter.catch',
      });
    } else {
      this.logger.error({
        context: 'HttpExceptionFilter.catch',
        error: exception,
        message: 'A non-http error being throw somewhere',
      });

      _.assign(errorData, { message: 'Internal server error' });
    }

    if (res) (res as any).error = exception;

    const isProductionEnv = this.configService.get('app.isProductionEnv');
    isProductionEnv && delete errorData.details;

    if (!res.headersSent) {
      httpAdapter.reply(ctx.getResponse(), errorData, httpStatus);
    }
  }
}
