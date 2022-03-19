import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { DishIngredientRepository } from './dish-ingredient.repository';
import { DishRepository } from './dish.repository';
import { CreateDishDto, DishIngredientInfo } from './Dto/create_dish.dto';
import { Dish } from './Enitity/dish.entity';

@Injectable()
export class DishService {
    constructor(
        @InjectRepository(DishRepository)
        private dishRepository: DishRepository,

        @InjectRepository(DishIngredientRepository)
        private dishIngredientRepository: DishIngredientRepository,

        private inventoryService: InventoryService,
        
    ){}

    // async GetDishs(filterDto: GetDishDto, user: User): Promise<Dish[]>{
    //     return this.dishRepository.getDishs(filterDto,user)
    // }
    
    async GetDishById(id: string): Promise<Dish>{
        return this.dishRepository.GetDishById(id)
    }

    async CreateListDishIngredient(ingredientInfo: DishIngredientInfo[], dishId: string){
        for (let i = 0; i < ingredientInfo.length; i++) {
            this.dishIngredientRepository.CraeteDishIngredient(
                await this.inventoryService.GetIngredientsById(ingredientInfo[i].ingredient_ids),
                ingredientInfo[i].amount,
                await this.GetDishById(dishId))
        }

        // ingredientInfo.forEach(async (ingredient) => this.dishIngredientRepository.CraeteDishIngredient(
        //     await this.inventoryService.GetIngredientsById(ingredient.ingredient_ids),
        //     ingredient.amount,
        //     await this.GetDishById(dishId)
        // ))

    }
    async CreateDish(createDishDto:CreateDishDto, user:User):Promise<Dish>{
        const {name,ingredient_infos} = createDishDto
        const newDish =await this.dishRepository.CreateDish(name, user)
        await this.CreateListDishIngredient(ingredient_infos, newDish.id)
        return newDish
    }
}
