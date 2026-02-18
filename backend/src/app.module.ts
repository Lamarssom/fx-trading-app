import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';
import { FxModule } from './fx/fx.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      //host: process.env.DB_HOST || 'localhost',
      //port: parseInt(process.env.DB_PORT ?? '5432', 10),
      //username: process.env.DB_USERNAME || 'postgres',
      //password: process.env.DB_PASSWORD || 'Biology1999web',
      //database: process.env.DB_NAME || 'fx_app',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true,
    }),
    AuthModule,
    WalletModule,
    FxModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
