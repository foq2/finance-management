import { registerAs } from '@nestjs/config';
import { NodeEnv } from '../enums';

export const appCommonConfiguration = registerAs('appCommon', () => ({
  timezone: process.env.TZ,
  nodeEnv: (process.env.NODE_ENV as NodeEnv) || NodeEnv.Local,
  logLevel: process.env.LOG_LEVEL || 'info',
  frontendUrl: process.env.FRONTEND_URL,
}));
