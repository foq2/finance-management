import { DtoField, PaginationQueryDto } from '@repo/nest-common';
import { PartialType, PickType } from '@nestjs/swagger';
import { EntryType } from '../../../data-access';

// ------------------------- Entry dto -----------------------------------------
export class TransactionEntryBodyDto {
  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `id of the account this entry posts to`,
  })
  accountId: string;

  @DtoField({
    type: EntryType,
    structure: 'enum',
    required: true,
    validated: true,
    description: `entry side: debit or credit`,
    example: EntryType.DEBIT,
  })
  type: EntryType;

  @DtoField({
    type: Number,
    required: true,
    validated: true,
    description: `positive amount for this entry`,
    example: 100.5,
  })
  amount: number;

  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `optional per-entry note`,
  })
  description?: string;
}

export class TransactionEntryResponseDto {
  @DtoField()
  id: string;

  @DtoField()
  accountId: string;

  @DtoField({ type: EntryType, structure: 'enum' })
  type: EntryType;

  @DtoField()
  amount: string;

  @DtoField()
  description: string;
}

// ------------------------- Base transaction dto ------------------------------
export class BaseTransactionResponseDto {
  @DtoField()
  id: string;

  @DtoField()
  userId: string;

  @DtoField()
  date: Date;

  @DtoField()
  description: string;

  @DtoField()
  reference: string;

  @DtoField()
  createdAt: Date;

  @DtoField()
  updatedAt: Date;
}

// ------------------------- Create transaction dto ----------------------------
export class CreateTransactionBodyDto {
  @DtoField({
    type: Date,
    required: true,
    validated: true,
    description: `transaction date`,
    example: '2026-11-03T00:00:00.000Z',
  })
  date: Date;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `transaction description`,
    example: 'Office supplies purchase',
  })
  description: string;

  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `optional external reference`,
    example: 'INV-1001',
  })
  reference?: string;

  @DtoField({
    type: TransactionEntryBodyDto,
    structure: 'dtoArray',
    required: true,
    validated: true,
    description: `debit/credit entries; total debits must equal total credits`,
  })
  entries: TransactionEntryBodyDto[];
}

export class CreateTransactionResponseDto extends PickType(
  BaseTransactionResponseDto,
  ['id'],
) {}

// ------------------------- Update transaction dto ----------------------------
export class UpdateTransactionBodyDto extends PartialType(
  CreateTransactionBodyDto,
) {}

export class UpdateTransactionResponseDto extends BaseTransactionResponseDto {
  @DtoField({ type: TransactionEntryResponseDto, structure: 'dtoArray' })
  entries: TransactionEntryResponseDto[];
}

// ------------------------- List transactions dto -----------------------------
export class ListTransactionQueryDto extends PaginationQueryDto {
  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `filter entries by account id`,
  })
  accountId?: string;
}

export class ListTransactionResponseDto extends BaseTransactionResponseDto {}

// ------------------------- Get transaction dto -------------------------------
export class GetTransactionResponseDto extends BaseTransactionResponseDto {
  @DtoField({ type: TransactionEntryResponseDto, structure: 'dtoArray' })
  entries: TransactionEntryResponseDto[];
}
