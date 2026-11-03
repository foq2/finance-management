import { DtoField, PaginationQueryDto } from '@repo/nest-common';
import { PartialType, PickType } from '@nestjs/swagger';
import { AccountType } from '../../../data-access';

export class BaseAccountResponseDto {
  @DtoField()
  id: string;

  @DtoField()
  userId: string;

  @DtoField()
  name: string;

  @DtoField({ type: AccountType, structure: 'enum' })
  type: AccountType;

  @DtoField()
  description: string;

  @DtoField()
  categoryId: string;

  @DtoField()
  createdAt: Date;

  @DtoField()
  updatedAt: Date;
}

// ------------------------- Create account dto --------------------------------
export class CreateAccountBodyDto {
  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `account's name`,
    example: 'Cash',
  })
  name: string;

  @DtoField({
    type: AccountType,
    structure: 'enum',
    required: true,
    validated: true,
    description: `account's type`,
    example: AccountType.ASSET,
  })
  type: AccountType;

  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: `account's description`,
    example: 'Petty cash on hand',
  })
  description?: string;

  @DtoField({
    type: String,
    required: true,
    validated: true,
    description: `id of the category this account belongs to`,
  })
  categoryId: string;
}

export class CreateAccountResponseDto extends PickType(BaseAccountResponseDto, [
  'id',
]) {}

// ------------------------- Update account dto --------------------------------
export class UpdateAccountBodyDto extends PartialType(CreateAccountBodyDto) {}

export class UpdateAccountResponseDto extends BaseAccountResponseDto {}

// ------------------------- List accounts dto ---------------------------------
export class ListAccountQueryDto extends PaginationQueryDto {
  @DtoField({
    type: AccountType,
    structure: 'enum',
    required: false,
    validated: true,
    description: `filter accounts by type`,
  })
  type?: AccountType;
}

export class ListAccountResponseDto extends BaseAccountResponseDto {}

// ------------------------- Get account dto -----------------------------------
export class GetAccountResponseDto extends BaseAccountResponseDto {}

// ------------------------- Account balance dto -------------------------------
export class AccountBalanceResponseDto {
  @DtoField()
  accountId: string;

  @DtoField({ type: AccountType, structure: 'enum' })
  type: AccountType;

  @DtoField()
  totalDebit: string;

  @DtoField()
  totalCredit: string;

  @DtoField({
    type: String,
    description: 'Normal-balance signed amount for the account type',
  })
  balance: string;
}
