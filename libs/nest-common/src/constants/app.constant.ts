import { NodeEnv } from '../enums';

export const APP_DEFAULTS = {
  NODE_ENV: NodeEnv.Local,
  APP_NAME: 'nest-micro',
  PAGINATION: {
    PAGE: 1,
    PAGE_SIZE: 10,
  },
};
