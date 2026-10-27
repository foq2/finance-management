import { DtoField } from '../../decorators';

// Message Pattern
export class VerifyUserPayloadDto {
  @DtoField({ type: String, required: true, validated: true })
  username: string;

  @DtoField({ type: String, required: true, validated: true })
  password: string;
}

export class VerifyUserResponseDto {
  @DtoField()
  userId: string;

  @DtoField()
  name: string;

  @DtoField()
  email: string;
}

// Event Pattern
