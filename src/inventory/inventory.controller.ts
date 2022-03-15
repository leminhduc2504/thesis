import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { Ingredient } from './ingredient.entity';
import { InventoryService } from './inventory.service'


@Controller('inventory')
@UseGuards(AuthGuard())
export class InventoryController {
    constructor(
        private inventoryService: InventoryService
    ){}

    // @Get("/ingredient")
    // async getAllIgredient(){
    //     return this.inventoryService.GetAllIngredient()
    // }

    @Post("/ingredient")
    async createIngredient(@Body() createIngredientDto: CreateIngredientDto): Promise<string>{
        return this.inventoryService.CreateIngredient(createIngredientDto)
    }

    @Delete('/ingredient/:id')
    async deleteIngredient(@Param('id') id: string): Promise<void> {
        return this.inventoryService.DeleteIngredient(id)
    }

    @Patch('/ingredient/threshold/:id')
    async updateThresholdIngredient(@Param('id') id: string, @Body() changeThresholdIngredientDto:ChangeThresholdIngredientDto):Promise<Ingredient>{
        return this.inventoryService.ChangeThresholdIngredient(id,changeThresholdIngredientDto)
    }
    
    
}
