import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { CommonCqrsBus } from '@repo/nest-core';
import {
  CLI_COMMAND_CONSTANTS,
  CLI_QUESTION_CONSTANTS,
} from '../cli.constants';
import { CreateUserCommand } from '../../modules/user';

@Command({
  name: CLI_COMMAND_CONSTANTS.CREATE_ADMIN,
  description: 'Creates a admin user',
  arguments: '[username] [password]',
})
export class CreateAdminCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly commonCqrsBus: CommonCqrsBus,
  ) {
    super();
  }

  async run(): Promise<void> {
    const answers = await this.inquirer.prompt<{
      username: string;
      password: string;
    }>(CLI_QUESTION_CONSTANTS.CREATE_ADMIN, undefined);
    const username = answers?.username.trim();
    const password = answers?.password.trim();

    try {
      await this.commonCqrsBus.executeCommand(
        new CreateUserCommand({
          username,
          password,
          name: 'Admin',
          email: 'admin@2026',
        }),
      );

      console.log(`\n✅ Admin created successfully: ${username}`);
    } catch (e) {
      console.error(`\n❌ Failed to create admin: ${e.message}`);
    }
  }
}
