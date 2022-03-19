import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrderRepository } from './order.repository';
import { Dish } from 'src/dish/Enitity/dish.entity';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderRepository,Dish]),AuthModule,DishModule],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
