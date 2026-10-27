import { Question, QuestionSet } from 'nest-commander';
import { CLI_QUESTION_CONSTANTS } from '../cli.constants';

@QuestionSet({ name: CLI_QUESTION_CONSTANTS.CREATE_ADMIN })
export class CreateAdminQuestions {
  @Question({
    type: 'input',
    message: 'please enter your username',
    name: 'username',
    validate: (username: string) => {
      const trimmed = username?.trim();

      if (!trimmed) {
        return 'Username cannot be empty!';
      }

      if (trimmed.length < 3 || trimmed.length > 20) {
        return 'Username must be between 3 and 20 characters long!';
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(trimmed)) {
        return 'Username can only contain letters, numbers, and underscores (_)!';
      }

      return true;
    },
  })
  parseUsername(username: string) {
    return username;
  }

  @Question({
    type: 'password',
    message: 'please enter your password',
    name: 'password',
    validate: (password: string) => {
      if (!password) {
        return 'Password cannot be empty!';
      }

      // TODO check password properly

      return true;
    },
  })
  parsePassword(password: string) {
    return password;
  }
}
