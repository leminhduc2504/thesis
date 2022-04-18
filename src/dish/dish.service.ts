import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateStockChangeHistoryDto } from 'src/inventory/Dto/create-stockHistory.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import { DishIngredientRepository } from './repository/dish-ingredient.repository';
import { DishRepository } from './repository/dish.repository';
import { CreateDishDto, DishIngredientInfo } from './Dto/create_dish.dto';
import { DishIngredient } from './Enitity/dish-ingredient.entity';
import { Dish } from './Enitity/dish.entity';
import { DishCategory } from './Enitity/dish-category.entity';
import { DishCategoryRepository } from './repository/dish-category-repository';
import { CreateDishCategoryDto } from './Dto/create-dish-category.dto';
import { QuerryFilterDishDto } from './Dto/qurry-dish-filter.dto';

@Injectable()
export class DishService {
    constructor(
        @InjectRepository(DishRepository)
        private dishRepository: DishRepository,

        @InjectRepository(DishIngredientRepository)
        private dishIngredientRepository: DishIngredientRepository,

        @InjectRepository(DishCategoryRepository)
        private dishCategoryRepository: DishCategoryRepository,

        private inventoryService: InventoryService,
        
    ){}

    async GetDishs(filterDto:QuerryFilterDishDto, user: User): Promise<Dish[]>{
        const {categoryName} = filterDto
        return this.dishRepository.getDishs(categoryName,user)
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

    async TakeIngredient(amount: number, dishId: string, user:User){
        const dish =await this.GetDishById(dishId)
        dish.dishIngredients.forEach(dishIngredient => {
            this.inventoryService.ChangeIngredient(amount*dishIngredient.amount, dishIngredient.ingredient.id)
            const note = "cooking"
            const createDto: CreateStockChangeHistoryDto = {note:"cooking",ingredient:dishIngredient.ingredient,amount:amount*dishIngredient.amount}
            this.inventoryService.CreateStockChange(createDto,user)
        })
    }

    async CreateCategory(createDishCategoryDto:CreateDishCategoryDto,user: User){
        const {categoryName} =createDishCategoryDto
        
        return this.dishCategoryRepository.CreateDishCategory(categoryName,user)
    }

    async AssignCategory(categoryId:string, dishId:string){
        const category =await this.dishCategoryRepository.GetCategoryById(categoryId)
        return this.dishRepository.AssignCategory(dishId,category)
    }

    async GetCategory(user:User): Promise<DishCategory[]>{
        return this.dishCategoryRepository.GetAllCategory(user)
    }
    
}
