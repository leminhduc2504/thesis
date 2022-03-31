import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateFeedbackDto } from './Dto/create-feedback-dto';
import { FeedbackFilterDto } from './Dto/get-filter-dto';
import { Feedback } from './Entity/feedback.entity';
import { PerformanceService } from './performance.service';

@Controller('performance')
@UseGuards(AuthGuard())
export class PerformanceController {
    constructor(
        private performanceService: PerformanceService
    ){}

    @Post("feedback")
    async CreateFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @GetUser() user: User
    ): Promise<Feedback>{
        return this.performanceService.CreateFeedback(createFeedbackDto,user)
    }

    @Get("/feedback")
    async GetFeedback(@Query() filterDto:FeedbackFilterDto, @GetUser() user: User): Promise<Feedback[]>{
        
        return this.performanceService.GetFeedback(filterDto,user)
    }
}
