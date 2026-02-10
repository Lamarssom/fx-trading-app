import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FxService } from './fx.service';

@Controller('fx')
@UseGuards(AuthGuard('jwt'))
export class FxController {
  constructor(private fxService: FxService) {}

  @Get('rates')
  async getRates(@Query('from') from: string, @Query('to') to: string) {
    return { rate: await this.fxService.getRate(from, to) };
  }
}