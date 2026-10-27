import { catchError, lastValueFrom, Observable, timeout } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function callMs<T = any>(res: Observable<T>, timeoutMs?: number) {
  const callTimeout =
    timeoutMs ||
    (process.env.CALL_SERVICE_TIMEOUT
      ? +process.env.CALL_SERVICE_TIMEOUT
      : 5000);

  const pipe = res.pipe(
    timeout(callTimeout),
    catchError((err) => {
      const statusCode = err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(
        {
          statusCode,
          message: err?.message || 'Internal Server Error',
          errorCode: err?.errorCode || 'internal_server_error',
          errorService: err?.errorService,
          stack: err?.stack,
          trace: err?.trace,
        },
        statusCode,
      );
    }),
  );

  return await lastValueFrom(pipe);
}
