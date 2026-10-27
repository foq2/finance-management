import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { appConfiguration } from './config';
import { ConfigType } from '@nestjs/config';
import {
  appCommonConfiguration,
  CommonLogger,
  logBootstrapInfo,
  setupApiDocs,
  MicroserviceName,
  tcpConfiguration,
  PayloadValidationPipe,
  MicroservicePrefix,
} from '@repo/nest-common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

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
  app.useGlobalPipes(new PayloadValidationPipe());

  // Microservice listener
  const { [MicroserviceName.UserService]: userTcpOption } = app.get<
    ConfigType<typeof tcpConfiguration>
  >(tcpConfiguration.KEY);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: userTcpOption,
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();

  // API docs
  await setupApiDocs(app, appName, [MicroservicePrefix.UserService]);

  await app.listen(appPort);

  logBootstrapInfo(app, {
    appPort,
    logger,
    nodeEnv,
    msListener: { transport: 'http', address: 'null' },
  });
}
bootstrap();
