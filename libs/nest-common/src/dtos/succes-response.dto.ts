import { DtoField } from '../decorators';

export class SuccessResponseDto {
  @DtoField()
  success: boolean = true;
}
