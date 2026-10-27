import { DtoField, SuccessResponseDto } from '@repo/nest-common';
import { PickType } from '@nestjs/swagger';

// -------------------------------- Login Dto ----------------------------------
export class LoginBodyDto {
  @DtoField({
    type: String,
    required: true,
    validated: true,
    example: 'testUser',
  })
  username: string;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    example: '12345678Aa@',
  })
  password: string;
}

export class LoginResponseDto {
  @DtoField()
  accessToken: string;

  @DtoField()
  refreshToken: string;
}

// ---------------------------------- Logout Dto -------------------------------
export class LogoutResponseDto extends SuccessResponseDto {}

// ------------------------------ Refresh Token Dto ----------------------------
export class RefreshTokenBodyDto {
  @DtoField({ type: String, required: true, validated: true })
  refreshToken: string;
}

export class RefreshTokenResponseDto extends PickType(LoginResponseDto, [
  'accessToken',
] as const) {}
