import { registerAs } from '@nestjs/config';

export const microserviceConfiguration = registerAs('microservice', () => ({
  authService: {
    host: process.env.AUTH_SERVICE_HOST,
    port: process.env.AUTH_SERVICE_PORT,
    url: process.env.AUTH_SERVICE_URL,
  },
  userService: {
    host: process.env.USER_SERVICE_HOST,
    port: process.env.USER_SERVICE_PORT,
    url: process.env.USER_SERVICE_URL,
  },
  gatewayKey: process.env.GATEWAY_KEY,
  gatewaySecret: process.env.GATEWAY_SECRET,
}));
