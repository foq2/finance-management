import { BaseSchema } from '@repo/nest-core';
import { UserRepository } from './user.repository';
import { defineEntity, p } from '@mikro-orm/core';

export const UserSchema = defineEntity({
  name: 'User',
  tableName: 'users',
  extends: BaseSchema,
  repository: () => UserRepository,
  properties: {
    name: p.string(),
    email: p.string(),
    username: p.string(),
    password: p.string().hidden(),
  },
});

export class UserEntity extends UserSchema.class {}
UserSchema.setClass(UserEntity);
