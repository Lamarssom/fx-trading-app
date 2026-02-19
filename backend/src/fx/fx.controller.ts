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

  @Get('Historical')
  async getHistorical(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('days') days: string = '30',
  ) {
    const numDays = parseInt(days || '30', 10);
    const historical = await this.fxService.getHistorical(from, to, numDays);
    return { historical };
  }
}
