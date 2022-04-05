import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FeedbackRepository } from './Repository/feedback.repository';
import { OrderModule } from 'src/order/order.module';
import { DishModule } from 'src/dish/dish.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRepository]),AuthModule,OrderModule,DishModule],
  providers: [PerformanceService],
  controllers: [PerformanceController]
})
export class PerformanceModule {}