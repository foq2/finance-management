import {
  GatewayTimeoutException,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import {
  jwtConfiguration,
  microserviceConfiguration,
  MicroservicePrefix,
} from '@repo/nest-common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from './middleware';
import { TimeoutError } from 'rxjs';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [jwtConfiguration.KEY],
      useFactory: (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        secret: jwtConfig.secret,
        signOptions: {
          algorithm: jwtConfig.algorithm,
        },
      }),
    }),
  ],
  providers: [JwtAuthMiddleware],
})
export class GatewayModule implements NestModule {
  constructor(
    @Inject(microserviceConfiguration.KEY)
    private readonly microserviceConfig: ConfigType<
      typeof microserviceConfiguration
    >,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const publicRoutes = [
      ':service/swagger',
      ':service/swagger/:path',
      ':service/api',
      'auth-service/api/auth/login',
      'auth-service/api/auth/refreshToken',
    ];

    consumer
      .apply(JwtAuthMiddleware)
      .exclude(...publicRoutes)
      .forRoutes(...Object.values(MicroservicePrefix));

    consumer
      .apply(
        this.createProxy(
          this.microserviceConfig.authService.url,
          MicroservicePrefix.AuthService,
        ),
      )
      .forRoutes(MicroservicePrefix.AuthService);

    consumer
      .apply(
        this.createProxy(
          this.microserviceConfig.userService.url,
          MicroservicePrefix.UserService,
        ),
      )
      .forRoutes(MicroservicePrefix.UserService);
  }

  private createProxy(targetUrl: string, pathPrefix: string) {
    return createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      proxyTimeout: 5000,
      timeout: 30000,
      pathRewrite: { [`^/${pathPrefix}`]: '' },
      on: {
        proxyReq: (proxyReq, req) => {
          proxyReq.setHeader(
            'x-internal-token',
            this.microserviceConfig.gatewaySecret,
          );
          fixRequestBody(proxyReq, req);
        },
        error: (err, req, res) => {
          if ('headersSent' in res && !res.headersSent) {
            throw new GatewayTimeoutException();
          }
        },
      },
    });
  }
}
