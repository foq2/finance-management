import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { appConfiguration } from './config';
import { ConfigType } from '@nestjs/config';
import {
  appCommonConfiguration,
  CommonLogger,
  logBootstrapInfo,
  MicroservicePrefix,
  setupApiDocs,
} from '@repo/nest-common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const { appPort, appName } = app.get<ConfigType<typeof appConfiguration>>(
    appConfiguration.KEY,
  );

  const { nodeEnv } = app.get<ConfigType<typeof appCommonConfiguration>>(
    appCommonConfiguration.KEY,
  );
  const logger = app.get(CommonLogger);

  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  // API docs
  await setupApiDocs(app, appName, [MicroservicePrefix.AuthService]);

  await app.listen(appPort);

  logBootstrapInfo(app, {
    nodeEnv,
    logger,
    appPort,
    msListener: { transport: 'http', address: 'null' },
  });
}
bootstrap();
