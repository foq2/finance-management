import { AppException, ERROR_RESPONSE, toDto } from '@repo/nest-common';
import { EntryType, Transaction } from '../../data-access';
import {
  BaseTransactionResponseDto,
  GetTransactionResponseDto,
  TransactionEntryBodyDto,
} from './dto';

// Compare with a small epsilon to avoid floating-point rounding issues.
const EPSILON = 1e-6;

/**
 * Validate a set of entries forms a balanced double-entry transaction:
 * at least two entries and total debits === total credits.
 * Throws AppException otherwise.
 */
export function assertBalancedEntries(
  entries: TransactionEntryBodyDto[],
): void {
  if (!entries || entries.length < 2) {
    throw new AppException(ERROR_RESPONSE.TRANSACTION_INVALID_ENTRIES);
  }

  let totalDebit = 0;
  let totalCredit = 0;
  for (const entry of entries) {
    const amount = Number(entry.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppException(ERROR_RESPONSE.TRANSACTION_INVALID_ENTRIES);
    }
    if (entry.type === EntryType.DEBIT) totalDebit += amount;
    else if (entry.type === EntryType.CREDIT) totalCredit += amount;
    else throw new AppException(ERROR_RESPONSE.TRANSACTION_INVALID_ENTRIES);
  }

  if (Math.abs(totalDebit - totalCredit) > EPSILON) {
    throw new AppException(ERROR_RESPONSE.TRANSACTION_NOT_BALANCED);
  }
}

export function toTransactionResponse(
  transaction: Transaction,
): BaseTransactionResponseDto {
  return toDto(BaseTransactionResponseDto, transaction);
}

export function toTransactionDetailResponse(
  transaction: Transaction,
): GetTransactionResponseDto {
  // Flatten the nested entries collection and rename `account` -> `accountId`
  // before the allowlist mapping (toDto can't rename nested fields on its own).
  return toDto(GetTransactionResponseDto, {
    ...transaction,
    entries: transaction.entries.getItems().map((entry) => ({
      id: entry.id,
      accountId: entry.account?.id,
      type: entry.type as EntryType,
      amount: String(entry.amount),
      description: entry.description,
    })),
  });
}
