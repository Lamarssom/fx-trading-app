import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { FxModule } from '../fx/fx.module';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletBalance, User, Transaction]), FxModule],
  providers: [WalletService, TransactionService],
  controllers: [WalletController],
})
export class WalletModule {}