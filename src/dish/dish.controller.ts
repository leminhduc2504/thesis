import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
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

    @Get()
    async GetDishs(
    @GetUser() user: User
    ): Promise<Dish[]>{
        return this.dishService.GetDishs(user)
    }

    @Get("/:id")
    async GetDishIngredients(
        @Param('id') dish_id: string,
    ){
        return this.dishService.GetDishIngredients(dish_id);
    }



    @Post()
    async CreateDish(
        @Body() createDishDto: CreateDishDto,
        @GetUser() user: User
        ): Promise<Dish>{
        return this.dishService.CreateDish(createDishDto,user)
    }

    @Delete('/:id')
    async deleteDish(
    @Param('id') id: string,
    @GetUser() user: User): Promise<void> {
        return this.dishService.DeleteDish(id,user)
    }
}
