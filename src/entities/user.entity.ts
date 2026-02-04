import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { WalletBalance } from './wallet-balance.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Hashed

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => WalletBalance, (balance) => balance.user, { cascade: true })
  balances: WalletBalance[];

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions: Transaction[];
}