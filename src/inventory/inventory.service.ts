import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { IngredientRepository } from './ingredient.repository';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(IngredientRepository)
        private inventoryRepository: IngredientRepository
    ){}

    async GetAllIngredient(){
        return null
    }

    async CreateIngredient(createIngredientDto:CreateIngredientDto):Promise<string>{
        return this.inventoryRepository.CreateIngredient(createIngredientDto)
    }

    async DeleteIngredient(id : string) : Promise<void>{
        return this.inventoryRepository.DeleteIngredient(id)
        console.log(id)
    }

    async ChangeThresholdIngredient(id:string, changeThresholdIngredientDto:ChangeThresholdIngredientDto):Promise<Ingredient>{
        return this.inventoryRepository.ChangeThreshold(id,changeThresholdIngredientDto)
    }
}
