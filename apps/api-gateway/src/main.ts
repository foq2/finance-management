import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ConfigType } from '@nestjs/config';
import {
  appCommonConfiguration,
  CommonLogger,
  logBootstrapInfo,
} from '@repo/nest-common';
import { appConfiguration } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const { appPort } = app.get<ConfigType<typeof appConfiguration>>(
    appConfiguration.KEY,
  );

  const { nodeEnv } = app.get<ConfigType<typeof appCommonConfiguration>>(
    appCommonConfiguration.KEY,
  );

  const logger = app.get(CommonLogger);
  app.useLogger(logger);

  await app.listen(appPort);

  logBootstrapInfo(app, { appPort, logger, nodeEnv });
}
bootstrap();
