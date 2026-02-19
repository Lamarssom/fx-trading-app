import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private txRepo: Repository<Transaction>,
  ) {}

  async getHistory(userId: string): Promise<Transaction[]> {
    return this.txRepo.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
    });
  }
}
