import { DtoField } from '../decorators';
import { Max, Min } from 'class-validator';

// ------------------------------- Pagination Dto ------------------------------
export class PaginationQueryDto {
  @DtoField({
    type: Number,
    required: false,
    validated: true,
    example: 1,
    description: 'This field is used for normal pagination',
  })
  @Min(1)
  page: number = 1;

  @DtoField({
    type: Number,
    required: false,
    validated: true,
    example: 20,
    description: '',
  })
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}

export class PaginationMetadataResponseDto {
  @DtoField()
  page: number;

  @DtoField()
  pageSize: number;

  @DtoField()
  totalPages: number;

  @DtoField()
  total: number;
}

export class PaginationResponseDto<T> {
  @DtoField()
  data: T[];

  @DtoField({
    type: PaginationMetadataResponseDto,
    structure: 'dto',
  })
  pagination: PaginationMetadataResponseDto;
}

// -------------------------- Cursor Pagination Dto ----------------------------
export class CursorPaginationQueryDto {
  @DtoField({
    type: Number,
    required: false,
    validated: true,
    example: 20,
    description: '',
  })
  limit?: number = 20;

  @DtoField({
    type: String,
    required: false,
    validated: true,
    description: 'Next page cursor for pagination',
  })
  cursor?: string;
}

export class CursorPaginationResponseDto<T> {
  @DtoField()
  data: T[];

  @DtoField()
  nextCursor: string;

  @DtoField()
  hasMore: boolean;
}
