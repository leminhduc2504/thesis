import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateFeedbackDto } from './Dto/create-feedback-dto';
import { DateFilterDto } from './Dto/get-filter-dto';
import { ReponseFeedbackDto } from './Dto/reponse-feedback-dto';
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
    async GetFeedback(@Query() filterDto:DateFilterDto, @GetUser() user: User): Promise<ReponseFeedbackDto>{
        return this.performanceService.GetFeedback(filterDto,user)
    }

    @Get("feedback-list")
    @UseGuards(AuthGuard())
    async GetFeedbackList(@Query() filterDto:DateFilterDto, @GetUser() user: User): Promise<Feedback[]>{
        return this.performanceService.GetFeedbackList(filterDto,user)
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

    @Get("order-amount-by-day")
    @UseGuards(AuthGuard())
    async GetOrderAmountByDay(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetOrderAmountByDay(date,user)
    }

    //ingredient 
    @Get("ingredient-amount-by-day")
    @UseGuards(AuthGuard())
    async GetIngredientAnalysByDay(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetIngredientAnalysByDay2(date,user)
    }

    //dish
    @Get("dish-amount-by-day")
    @UseGuards(AuthGuard())
    async GetDishAnalysByDay(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetDishAnalysByDay2(date,user)
    }

    //test
    @Get("performance-by-hour")
    @UseGuards(AuthGuard())
    async DishIngredientByHour(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetDishIngredientByHours(date,user)
    }

    @Get("order-by-hour")
    @UseGuards(AuthGuard())
    async GetOrderByHours(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetOrderByHours(date,user)
    }

    @Get("dishes-cooking-time")
    @UseGuards(AuthGuard())
    async GetDishesCookingTime(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetDishCookingPerformanceByDay(date,user)
    }

    @Get("top5")
    @UseGuards(AuthGuard())
    async GetIngredientChangeStockByDay(@Query() date: DateFilterDto, @GetUser() user: User){
        return this.performanceService.GetTop5DishIngredient7Days(date,user)
    }


}
