import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { DishIngredientRepository } from './dish-ingredient.repository';
import { DishRepository } from './dish.repository';
import { CreateDishDto, DishIngredientInfo } from './Dto/create_dish.dto';
import { DishIngredient } from './Enitity/dish-ingredient.entity';
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

    async GetDishs( user: User): Promise<Dish[]>{
        return this.dishRepository.getDishs(user)
    }
    
    async GetDishById(id: string): Promise<Dish>{
        return this.dishRepository.GetDishById(id)
    }

    async GetDishIngredients(dish_id: string): Promise<DishIngredient[]>{
        return this.dishIngredientRepository.GetDishIngredients(dish_id)
    }

    async CreateListDishIngredient(ingredientInfo: DishIngredientInfo[], dishId: string){
        for (let i = 0; i < ingredientInfo.length; i++) {
            this.dishIngredientRepository.CraeteDishIngredient(
                await this.inventoryService.GetIngredientsById(ingredientInfo[i].ingredientId),
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
        const {name,retailPrice,ingredientPrice,ingredientInfos} = createDishDto
        const newDish =await this.dishRepository.CreateDish(name,retailPrice,ingredientPrice, user)
        await this.CreateListDishIngredient(ingredientInfos, newDish.id)
        return newDish
    }

    async DeleteDish(id:string, user:User){
        return this.dishRepository.DeleteDish(id,user)
    }

    async TakeIngredient(amount: number, dishId: string){
        const dish =await this.GetDishById(dishId)
        dish.dishIngredients.forEach(dishIngredient => {
            this.inventoryService.TakeIngredient(amount*dishIngredient.amount, dishIngredient.ingredient.id)
        })
    }

    
}
