import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { GetIngredientsFilterDto } from './Dto/get-ingredients-filter-dto';
import { Ingredient } from './Entity/ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(IngredientRepository)
        private inventoryRepository: IngredientRepository
    ){}

    async GetIngredients(filterDto: GetIngredientsFilterDto, user: User): Promise<Ingredient[]>{
        return this.inventoryRepository.getIngredients(filterDto,user)
    }

    async CreateIngredient(createIngredientDto:CreateIngredientDto, user:User):Promise<string>{
        return this.inventoryRepository.CreateIngredient(createIngredientDto, user)
    }

    async DeleteIngredient(id : string) : Promise<void>{
        return this.inventoryRepository.DeleteIngredient(id)

    }

    async ChangeThresholdIngredient(id:string, changeThresholdIngredientDto:ChangeThresholdIngredientDto):Promise<Ingredient>{
        return this.inventoryRepository.ChangeThreshold(id,changeThresholdIngredientDto)
    }
}
