import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';
import { FundDto } from '../dto/fund.dto';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  async getWallet(@Req() req) {
    return this.walletService.getBalances(req.user.userId);
  }

  @Post('fund')
  async fund(@Req() req, @Body() body: FundDto) {
    return this.walletService.fund(req.user.userId, body.currency, body.amount,);      
  }
  
  @Post('convert')
  async convert(@Req() req, @Body() body: { fromCurrency: string; toCurrency: string; amount: number }) {
    return this.walletService.convert(req.user.userId, body.fromCurrency, body.toCurrency, body.amount);
  }

  @Post('trade')
  async trade(@Req() req, @Body() body: { fromCurrency: string; toCurrency: string; amount: number }) {
    return this.walletService.trade(req.user.userId, body.fromCurrency, body.toCurrency, body.amount);
  }
}