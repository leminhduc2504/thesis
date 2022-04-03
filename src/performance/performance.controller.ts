import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateFeedbackDto } from './Dto/create-feedback-dto';
import { DateFilterDto } from './Dto/get-filter-dto';
import { Feedback } from './Entity/feedback.entity';
import { PerformanceService } from './performance.service';

@Controller('performance')

export class PerformanceController {
    constructor(
        private performanceService: PerformanceService,

    ){}

    @Post("feedback")
    async CreateFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto
    ): Promise<Feedback>{
       
        return this.performanceService.CreateFeedback(createFeedbackDto)
    }

    @Get("feedback")
    @UseGuards(AuthGuard())
    async GetFeedback(@Query() filterDto:DateFilterDto, @GetUser() user: User): Promise<Feedback[]>{
        
        return this.performanceService.GetFeedback(filterDto,user)
    }

    //financial


    // async GetRevenue(dateFilterDto: DateFilterDto, @GetUser() user: User ) {
    //     return this.performanceService.
    // }


    //ingredient



    //order
    @Get("order")
    @UseGuards(AuthGuard())
    async GetOrderPerformanceDaily(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetOrderPerformanceDaily(date,user)
    }



    //dish
}
