import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository]),AuthModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
