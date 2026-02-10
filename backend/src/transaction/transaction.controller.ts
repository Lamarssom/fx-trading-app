import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from './transaction.service';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(private txService: TransactionService) {}

  @Get()
  async getTransactions(@Req() req) {
    return this.txService.getHistory(req.user.userId);
  }
}