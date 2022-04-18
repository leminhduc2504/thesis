import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { DishService } from './dish.service';
import { CreateDishCategoryDto } from './Dto/create-dish-category.dto';
import { CreateDishDto } from './Dto/create_dish.dto';
import { QuerryFilterDishDto } from './Dto/qurry-dish-filter.dto';
import { DishCategory } from './Enitity/dish-category.entity';
import { Dish } from './Enitity/dish.entity';

@Controller('dish')
@UseGuards(AuthGuard())
export class DishController {
    orderService: any;
    constructor(
        private dishService: DishService
    ){}

    @Get()
    async GetDishs( @Query() filterDto:QuerryFilterDishDto,
    @GetUser() user: User): Promise<Dish[]>{
        return this.dishService.GetDishs(filterDto,user)
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

    @Post('/category')
    async CreateDishCategory(
        @Body() createDishCateDto: CreateDishCategoryDto,
        @GetUser() user: User
        ){
        return this.dishService.CreateCategory(createDishCateDto,user)
    }

    @Patch('/category/:categoryId/:dishId')
    async AssignDishCategory(
        @Param('categoryId') categoryId: string,
        @Param('dishId') dishId: string,
    ){
        
        return this.dishService.AssignCategory(categoryId,dishId)
    }

    @Get('/category/get')
    async GetCategory(@GetUser() user: User):Promise<DishCategory[]>
    {
        return this.dishService.GetCategory(user)
    }
    
}
