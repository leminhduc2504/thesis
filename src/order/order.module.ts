import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from './order.repository';
import { DishModule } from 'src/dish/dish.module';
import { OrderDishRepository } from './order-dish.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository,OrderDishRepository]),AuthModule,DishModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
