import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiDocument,
  Public,
  User,
  UserRequestPayload,
} from '@repo/nest-common';
import {
  LoginBodyDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenBodyDto,
  RefreshTokenResponseDto,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiDocument({
    operation: {
      operationId: 'login',
      summary: 'Api login',
    },
    response: {
      status: HttpStatus.OK,
      type: LoginResponseDto,
    },
  })
  @Post('login')
  async login(@Body() body: LoginBodyDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiDocument({
    operation: {
      operationId: 'logout',
      summary: 'Api logout',
    },
    response: {
      status: HttpStatus.OK,
      type: LogoutResponseDto,
    },
  })
  async logout(@User() user: UserRequestPayload): Promise<LogoutResponseDto> {
    return this.authService.logout(user);
  }

  @Post('refreshToken')
  @Public()
  @ApiDocument({
    operation: {
      operationId: 'refreshToken',
      summary: 'Api refreshToken',
    },
    response: {
      status: HttpStatus.OK,
      type: RefreshTokenResponseDto,
    },
  })
  async refreshToken(
    @Body() body: RefreshTokenBodyDto,
  ): Promise<RefreshTokenResponseDto> {
    return this.authService.refreshToken(body);
  }
}
