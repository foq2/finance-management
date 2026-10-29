import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiDocument, SuccessResponseDto, User } from '@repo/nest-common';
import {
  CreateUserBodyDto,
  CreateUserResponseDto,
  GetInfoResponseDto,
} from './dto';
import { CreateUserCommand } from './commands';
import { GetInfoQuery } from './queries';
import { CommonCqrsBus } from '@repo/nest-core';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly commonCqrsBus: CommonCqrsBus) {}

  @Get()
  @ApiDocument({
    operation: {
      operationId: 'getInfo',
      summary: 'Api getInfo',
    },
    response: {
      status: HttpStatus.OK,
      type: GetInfoResponseDto,
    },
  })
  async getInfo(@User('userId') id: string): Promise<GetInfoResponseDto> {
    return this.commonCqrsBus.executeQuery(new GetInfoQuery(id));
  }

  @Post()
  @ApiDocument({
    operation: {
      operationId: 'createUser',
      summary: 'Api createUser',
    },
    response: {
      status: HttpStatus.CREATED,
      type: SuccessResponseDto,
    },
  })
  async createUser(
    @Body() body: CreateUserBodyDto,
  ): Promise<CreateUserResponseDto> {
    return this.commonCqrsBus.executeCommand(new CreateUserCommand(body));
  }

  // TODO add more api? list/get-one/update/delete
}
