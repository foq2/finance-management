import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfiguration } from '@repo/nest-common';
import { ConfigModule, ConfigType } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfiguration)],
      useFactory: (jwtConfig: ConfigType<typeof jwtConfiguration>) => ({
        global: true,
        secret: jwtConfig.secret,
        signOptions: {
          algorithm: jwtConfig.algorithm,
        },
      }),
      inject: [jwtConfiguration.KEY],
    }),
    ConfigModule.forFeature(jwtConfiguration),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
