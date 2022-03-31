import { Module } from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FeedbackRepository } from './Repository/feedback.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRepository]),AuthModule],
  providers: [PerformanceService],
  controllers: [PerformanceController]
})
export class PerformanceModule {}
