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
  CreateTransactionBodyDto,
  CreateTransactionResponseDto,
  GetTransactionResponseDto,
  ListTransactionQueryDto,
  ListTransactionResponseDto,
  UpdateTransactionBodyDto,
  UpdateTransactionResponseDto,
} from './dto';
import {
  CreateTransactionCommand,
  DeleteTransactionCommand,
  UpdateTransactionCommand,
} from './commands';
import { GetTransactionQuery, ListTransactionQuery } from './queries';

@Controller('transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly commonCqrsBus: CommonCqrsBus) {}

  @Post()
  @ApiDocument({
    operation: {
      operationId: 'createTransaction',
      summary: 'Api createTransaction',
    },
    response: {
      status: HttpStatus.CREATED,
      type: CreateTransactionResponseDto,
    },
  })
  async createTransaction(
    @User('userId') userId: string,
    @Body() body: CreateTransactionBodyDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new CreateTransactionCommand(userId, body),
    );
  }

  @Get()
  @ApiDocument({
    operation: {
      operationId: 'listTransaction',
      summary: 'Api listTransaction',
    },
    response: {
      status: HttpStatus.OK,
      type: ListTransactionResponseDto,
      paginationDto: PaginationResponseDto,
    },
  })
  async listTransaction(
    @User('userId') userId: string,
    @Query() query: ListTransactionQueryDto,
  ): Promise<PaginationResponseDto<ListTransactionResponseDto>> {
    return this.commonCqrsBus.executeQuery(
      new ListTransactionQuery(userId, query),
    );
  }

  @Get(':id')
  @ApiDocument({
    operation: {
      operationId: 'getTransaction',
      summary: 'Api getTransaction',
    },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: GetTransactionResponseDto },
  })
  async getTransaction(
    @User('userId') userId: string,
    @Param('id') id: string,
  ): Promise<GetTransactionResponseDto> {
    return this.commonCqrsBus.executeQuery(new GetTransactionQuery(userId, id));
  }

  @Patch(':id')
  @ApiDocument({
    operation: {
      operationId: 'updateTransaction',
      summary: 'Api updateTransaction',
    },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: UpdateTransactionResponseDto },
  })
  async updateTransaction(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() body: UpdateTransactionBodyDto,
  ): Promise<UpdateTransactionResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new UpdateTransactionCommand(userId, id, body),
    );
  }

  @Delete(':id')
  @ApiDocument({
    operation: {
      operationId: 'deleteTransaction',
      summary: 'Api deleteTransaction',
    },
    param: { name: 'id', type: String },
    response: { status: HttpStatus.OK, type: SuccessResponseDto },
  })
  async deleteTransaction(
    @User('userId') userId: string,
    @Param('id') id: string,
  ): Promise<SuccessResponseDto> {
    return this.commonCqrsBus.executeCommand(
      new DeleteTransactionCommand(userId, id),
    );
  }
}
