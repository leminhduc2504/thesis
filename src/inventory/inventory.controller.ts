import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { GetIngredientsFilterDto } from './Dto/get-ingredients-filter-dto';
import { Ingredient } from './entity/ingredient.entity';
import { InventoryService } from './inventory.service'


@Controller('inventory')
@UseGuards(AuthGuard())
export class InventoryController {
    constructor(
        private inventoryService: InventoryService
    ){}

    @Get("/ingredient")
    async getIngredients(@Query() filterDto:GetIngredientsFilterDto,
    @GetUser() user: User
    ): Promise<Ingredient[]>{
        return this.inventoryService.GetIngredients(filterDto,user)
    }

    @Post("/ingredient")
    async createIngredient(
        @Body() createIngredientDto: CreateIngredientDto,
        @GetUser() user: User
        ): Promise<string>{
        return this.inventoryService.CreateIngredient(createIngredientDto,user)
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