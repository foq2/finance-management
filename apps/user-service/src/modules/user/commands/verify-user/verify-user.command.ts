import { VerifyUserPayloadDto } from '@repo/nest-common';

export class VerifyUserCommand {
  public readonly username: string;
  public readonly password: string;

  constructor(payload: VerifyUserPayloadDto) {
    Object.assign(this, payload);
  }
}
