import { Controller, HttpException } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { UserMessagePattern, VerifyUserPayloadDto } from '@repo/nest-common';
import { VerifyUserCommand } from './commands';
import { CommonCqrsBus } from '@repo/nest-core';

@Controller()
export class UserConsumer {
  constructor(private readonly commonCqrsBus: CommonCqrsBus) {}

  @MessagePattern('123', Transport.TCP)
  async test() {
    throw new HttpException('Lỗi cố tình throw từ Service B để test!', 400);
    // return 'test oke';
  }

  @EventPattern()
  async event() {
    return 'event';
  }

  @MessagePattern(UserMessagePattern.GetUser, Transport.TCP)
  async getUser(data: any) {}

  @MessagePattern(UserMessagePattern.VerifyUser, Transport.TCP)
  async verifyUser(@Payload() payload: VerifyUserPayloadDto) {
    return this.commonCqrsBus.executeCommand(new VerifyUserCommand(payload));
  }
}
