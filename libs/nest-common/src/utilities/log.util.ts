import { INestApplication, LoggerService } from '@nestjs/common';
import { NodeEnv } from '../enums';

interface LogBootstrapOptions {
  nodeEnv: NodeEnv;
  logger: LoggerService;
  appPort: number;
  msListener?: { transport: string; address?: string };
}

export function logBootstrapInfo(
  app: INestApplication,
  logOptions: LogBootstrapOptions,
) {
  const { nodeEnv, logger, appPort, msListener } = logOptions;

  if (nodeEnv === NodeEnv.Production) {
    logger.log(`Application is running on port ${appPort}`);
  }

  const appAddressInfo = app.getHttpServer().address();
  let host = 'localhost';

  if (typeof appAddressInfo === 'object' && appAddressInfo !== null) {
    host = appAddressInfo.address === '::' ? host : appAddressInfo.address;
  }

  if (msListener) {
    logger.log(
      `${msListener.transport} Microservice Listener is ready on ${msListener.address || 'Unknown'}`,
    );
  }

  logger.log(
    `Application is ready.\n` +
      ` View API Documentation:\n` +
      `  - Swagger : http://${host}:${appPort}/swagger\n` +
      `  - Scalar  : http://${host}:${appPort}/scalar\n` +
      `  - Redoc   : http://${host}:${appPort}/redoc`,
  );
}
