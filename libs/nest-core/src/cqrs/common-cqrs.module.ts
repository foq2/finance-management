import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommonCqrsBus } from './common-cqrs.bus';

@Global()
@Module({
  imports: [CqrsModule.forRoot()],
  providers: [CommonCqrsBus],
  exports: [CqrsModule, CommonCqrsBus],
})
export class CommonCqrsModule {}
