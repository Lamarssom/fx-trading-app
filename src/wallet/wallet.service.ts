import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletBalance } from '../entities/wallet-balance.entity';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { FxService } from '../fx/fx.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletBalance) private balanceRepo: Repository<WalletBalance>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
    private fxService: FxService,
    private dataSource: DataSource,
  ) {}

  async getBalances(userId: string): Promise<WalletBalance[]> {
    return this.balanceRepo.find({ where: { user: { id: userId } } });
  }

  async fund(userId: string, currency: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      let balance = await queryRunner.manager.findOne(WalletBalance, {
        where: { user: { id: userId }, currency },
      });

      if (!balance) {
        balance = queryRunner.manager.create(WalletBalance, { user, currency, amount: 0 });
        await queryRunner.manager.save(balance);
      }
      balance.amount += amount;
      await queryRunner.manager.save(balance);

      const tx = queryRunner.manager.create(Transaction, {
        user,
        type: 'fund',
        amount,
        fromCurrency: currency,
        toCurrency: currency,
        status: 'success',
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return balance;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async convert(userId: string, fromCurrency: string, toCurrency: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, { where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');

      const fromBalance = await queryRunner.manager.findOne(WalletBalance, {
        where: { user: { id: userId }, currency: fromCurrency },
      });
      if (!fromBalance || fromBalance.amount < amount) throw new BadRequestException('Insufficient balance');

      const rate = await this.fxService.getRate(fromCurrency, toCurrency);
      const convertedAmount = amount * rate;

      fromBalance.amount -= amount;
      await queryRunner.manager.save(fromBalance);

      let toBalance = await queryRunner.manager.findOne(WalletBalance, {
        where: { user: { id: userId }, currency: toCurrency },
      });
      if (!toBalance) {
        toBalance = queryRunner.manager.create(WalletBalance, { user, currency: toCurrency, amount: 0 });
        await queryRunner.manager.save(toBalance);
      }
      toBalance.amount += convertedAmount;
      await queryRunner.manager.save(toBalance);

      const tx = queryRunner.manager.create(Transaction, {
        user,
        type: 'convert',
        amount,
        fromCurrency,
        toCurrency,
        rate,
        status: 'success',
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return { convertedAmount };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async trade(userId: string, fromCurrency: string, toCurrency: string, amount: number) {
    return this.convert(userId, fromCurrency, toCurrency, amount);
  }
}