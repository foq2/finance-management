import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { microserviceConfiguration } from '../config';
import { ConfigType } from '@nestjs/config';
import { AppException } from '../exceptions';
import { ERROR_RESPONSE } from '../constants';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(microserviceConfiguration.KEY)
    private readonly microserviceConfig: ConfigType<
      typeof microserviceConfiguration
    >,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const key = 'x-internal-token';
    const gatewaySecret = req?.headers?.[key];

    if (
      !gatewaySecret ||
      gatewaySecret !== this.microserviceConfig.gatewaySecret
    ) {
      throw new AppException(ERROR_RESPONSE.INVALID_CREDENTIALS);
    }

    const userData = req?.headers['x-user-data'];
    if (userData) {
      try {
        req.user = JSON.parse(Buffer.from(userData, 'base64').toString());
      } catch {
        throw new AppException(ERROR_RESPONSE.INTERNAL_SERVER_ERROR);
      }
    }

    return true;
  }
}
