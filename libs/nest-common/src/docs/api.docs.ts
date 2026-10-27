import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { RedocModule } from 'nestjs-redoc';

export async function setupApiDocs(
  app: INestApplication,
  appName: string,
  serverUrls?: string[],
) {
  const config = new DocumentBuilder()
    .setTitle(`${appName} API Documentation`)
    .setDescription(`${appName} Description`)
    // .setVersion('1.0.0')
    // .addServer('/', 'Local machine')
    .addBearerAuth();

  if (serverUrls) {
    serverUrls.forEach((url) => config.addServer(`/${url}`));
  }

  const document = SwaggerModule.createDocument(app, config.build());

  // Swagger
  SwaggerModule.setup('swagger', app, document, {
    explorer: true,
    swaggerOptions: {
      customSiteTitle: `${appName} API Documentation`,
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
    },
  });

  // Scalar
  app.use('/scalar', apiReference({ content: document }));

  // Redoc
  await RedocModule.setup('redoc', app, document, {
    title: `${appName} API Documentation`,
  });
}
