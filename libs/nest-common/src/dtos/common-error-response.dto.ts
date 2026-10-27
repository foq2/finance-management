import { DtoField } from '../decorators';

export class CommonErrorResponseDto {
  @DtoField()
  statusCode: number;

  @DtoField()
  timestamps?: string;

  @DtoField()
  path?: string;

  @DtoField()
  errorCode: string;

  // @DtoField()
  // errorService?: string;

  @DtoField()
  message: string;

  @DtoField()
  details?: object;
}
