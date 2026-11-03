import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiDocument,
  PaginationResponseDto,
  SuccessResponseDto,
  User,
} from '@repo/nest-common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommonCqrsBus } from '@repo/nest-core';
import {
  AccountBalanceResponseDto,
  CreateAccountBodyDto,
  CreateAccountResponseDto,
  GetAccountResponseDto,
  ListAccountQueryDto,
  ListAccountResponseDto,
  UpdateAccountBodyDto,
  UpdateAccountResponseDto,
} from './dto';
import {
  CreateAccountCommand,
  DeleteAccountCommand,
  UpdateAccountCommand,
} from './commands';
import {
  GetAccountBalanceQuery,
  GetAccountQuery,
  ListAccountQuery,
} from './queries';

@Controller('account')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly commonCqrsBus: CommonCqrsBus) {}

  @Post()
  @ApiDocument({
    operation: { operationId: 'createAccount', summary: 'Api createAccount' },
    response: { status: HttpStatus.CREATED, type: CreateAccountResponseDto },
  })
  async createAccount(
    @User('userId') userId: string,
    @Body() body: CreateAccountBodyDto,
  ): Promise<CreateAccountResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new CreateAccountCommand(userId, body),
    );
  }

  @Get()
  @ApiDocument({
    operation: { operationId: 'listAccount', summary: 'Api listAccount' },
    response: {
      status: HttpStatus.OK,
      type: ListAccountResponseDto,
      paginationDto: PaginationResponseDto,
    },
  })
  async listAccount(
    @User('userId') userId: string,
    @Query() query: ListAccountQueryDto,
  ): Promise<PaginationResponseDto<ListAccountResponseDto>> {
    return this.commonCqrsBus.executeQuery(new ListAccountQuery(userId, query));
  }

  @Get(':id')
  @ApiDocument({
    operation: { operationId: 'getAccount', summary: 'Api getAccount' },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: GetAccountResponseDto },
  })
  async getAccount(
    @User('userId') userId: string,
    @Param('id') id: string,
  ): Promise<GetAccountResponseDto> {
    return this.commonCqrsBus.executeQuery(new GetAccountQuery(userId, id));
  }

  @Get(':id/balance')
  @ApiDocument({
    operation: {
      operationId: 'getAccountBalance',
      summary: 'Api getAccountBalance',
    },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: AccountBalanceResponseDto },
  })
  async getAccountBalance(
    @User('userId') userId: string,
    @Param('id') id: string,
  ): Promise<AccountBalanceResponseDto> {
    return this.commonCqrsBus.executeQuery(
      new GetAccountBalanceQuery(userId, id),
    );
  }

  @Patch(':id')
  @ApiDocument({
    operation: { operationId: 'updateAccount', summary: 'Api updateAccount' },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: UpdateAccountResponseDto },
  })
  async updateAccount(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() body: UpdateAccountBodyDto,
  ): Promise<UpdateAccountResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new UpdateAccountCommand(userId, id, body),
    );
  }

  @Delete(':id')
  @ApiDocument({
    operation: { operationId: 'deleteAccount', summary: 'Api deleteAccount' },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: SuccessResponseDto },
  })
  async deleteAccount(
    @User('userId') userId: string,
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new DeleteAccountCommand(userId, id),
    );
  }
}
