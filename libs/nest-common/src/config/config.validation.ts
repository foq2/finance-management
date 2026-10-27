// joi
// import Joi from 'joi';
//
// export const validationSchema = Joi.object({
//   TZ: Joi.string().required(),
//   NODE_ENV: Joi.string().required(),
//   FRONTEND_URL: Joi.string().required(),
// })

// zod
import { z } from 'zod';

export const validationSchema = z.looseObject({
  // TZ: z.string(),
  // NODE_ENV: z.enum(NodeEnv),
  FRONTEND_URL: z.url(),
  AUTH_SERVICE_HOST: z.string(),
  AUTH_SERVICE_PORT: z.string(), // z.coerce.number(),
  AUTH_SERVICE_URL: z.string(),
  USER_SERVICE_HOST: z.string(),
  USER_SERVICE_PORT: z.string(),
  USER_SERVICE_URL: z.string(),
  GATEWAY_SECRET: z.string(),
  // API_GATEWAY_PORT: z.string(),
});

export function validate(config: Record<string, unknown>) {
  const result = validationSchema.safeParse(config);
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      console.error(`${issue.path.join('.')}: ${issue.message}`);
    });
    throw new Error('Invalid environment variables');
  }
  return result.data;
}
