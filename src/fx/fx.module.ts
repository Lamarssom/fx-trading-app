import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { FxService } from './fx.service';
import { FxController } from './fx.controller';

@Module({
  imports: [HttpModule, CacheModule.register({ ttl: 60 })], // 1 min cache
  providers: [FxService],
  controllers: [FxController],
  exports: [FxService],
})
export class FxModule {}