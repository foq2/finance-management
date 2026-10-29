import { UserEntity } from './user.entity';
import { BaseRepository } from '@repo/nest-core';

export class UserRepository extends BaseRepository<UserEntity> {}
