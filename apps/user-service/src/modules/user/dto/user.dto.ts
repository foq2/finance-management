import { DtoField } from '@repo/nest-common';
import { PickType } from '@nestjs/swagger';

export class BaseUserResponseDto {
  @DtoField()
  id: string;

  @DtoField()
  name: string;

  @DtoField()
  email: string;

  @DtoField()
  username: string;

  @DtoField()
  createdAt: Date;

  @DtoField()
  updatedAt: Date;
}

// ------------------------- Create user dto -----------------------------------
export class CreateUserBodyDto {
  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `user's name`,
    example: 'foq',
  })
  name?: string;

  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `user's email`,
    example: 'foq@email.com',
  })
  email?: string;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `user's username`,
    example: 'foq',
  })
  username: string;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `user's password`,
    example: 'foq',
  })
  password: string;
}

export class CreateUserResponseDto extends PickType(BaseUserResponseDto, [
  'id',
]) {}

// ---------------------- Get User Info Dto ------------------------------------
export class GetInfoResponseDto extends BaseUserResponseDto {}
