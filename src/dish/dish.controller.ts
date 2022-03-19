import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DishService } from './dish.service';
import { CreateDishDto } from './Dto/create_dish.dto';
import { Dish } from './Enitity/dish.entity';

@Controller('dish')
@UseGuards(AuthGuard())
export class DishController {
    orderService: any;
    constructor(
        private dishService: DishService
    ){}

    // @Get()
    // async getDishs(
    // @GetUser() user: User
    // ): Promise<Dish[]>{
    //     return this.dishService.GetDishs(user)
    // }

    @Post()
    async createDish(
        @Body() createDishDto: CreateDishDto,
        @GetUser() user: User
        ): Promise<Dish>{
        return this.dishService.CreateDish(createDishDto,user)
    }
}
