import { CreateUserBodyDto } from '../../dto';

export class CreateUserCommand {
  public readonly name: string;
  public readonly email: string;
  public readonly username: string;
  public readonly password: string;

  constructor(body: CreateUserBodyDto) {
    Object.assign(this, body);
  }
}
