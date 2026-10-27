import { JwtTokenType } from '../enums';

export class UserRequestPayload {
  userId: string;
  jti: string;
}

export class TokenPayload extends UserRequestPayload {
  type?: JwtTokenType;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}
