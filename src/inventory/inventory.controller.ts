import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { CreateIngredientCategoryDto } from './Dto/create-ingredientCategory.dto';
import { CreateInvoiceDto } from './Dto/create-invoce.dto';
import { GetIngredientsFilterDto } from './Dto/get-ingredients-filter-dto';
import { StockChangeHistory } from './Entity/history-change.entity';
import { IngredientCategory } from './Entity/ingredient-category.entity';
import { Ingredient } from './Entity/ingredient.entity';
import { Invoice } from './Entity/invoice.entity';
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
    async deleteIngredient(@Param('id') id: string,@GetUser() user: User): Promise<void> {
        return this.inventoryService.DeleteIngredient(id,user)
    }

    @Patch('/ingredient/threshold/:id')
    async updateThresholdIngredient(@Param('id') id: string, @Body() changeThresholdIngredientDto:ChangeThresholdIngredientDto):Promise<Ingredient>{
        return this.inventoryService.ChangeThresholdIngredient(id,changeThresholdIngredientDto)
    }
    
    @Patch('/ingredient/set-supplier/:id')
    async SetSupplier(@Param('id') ingredientId: string,@Body() supplierId: {supplierId: string}, @GetUser() user: User){
        return this.inventoryService.SetSupplier(ingredientId,supplierId,user)
    }

    @Get("invoice")
    async GetInvoice(
        @GetUser() user: User
    ): Promise<Invoice[]>{
        return this.inventoryService.GetInvoice(user)
    }

    @Post("invoice")
    async CreateInvoice(
        @Body() createInvoiceDto: CreateInvoiceDto,
        @GetUser() user: User
    ): Promise<Invoice>{
        return this.inventoryService.CreateInvoice(createInvoiceDto,user)
    }

    @Patch("invoice/accept/:id")
    async AcceptInvoice(@Param('id') invoiceId: string,@GetUser() user: User){
        return this.inventoryService.AcceptInvoice(invoiceId,user )
    }

    // @Patch("ingredient/turnon-autorefill/:id")
    // async TurnOnAutoRefill(@Param('id') ingreidentId: string,@GetUser() user: User){
    //     return this.inventoryService.TurnOnAutoRefill(ingreidentId,user)
    // }

    @Get("stock-change")
    async GetStockChange(@GetUser() user: User): Promise<StockChangeHistory[]>{
        return this.inventoryService.GetStockChangeHistory(user)
    }

    @Post('/category')
    async CreateCategory(
        @Body() createDishCateDto: CreateIngredientCategoryDto,
        @GetUser() user: User
        ){
        return this.inventoryService.CreateCategory(createDishCateDto,user)
    }

    @Patch('/category/:categoryId/:dishId')
    async AssignDishCategory(
        @Param('categoryId') categoryId: string,
        @Param('dishId') dishId: string,
    ){
        
        return this.inventoryService.AssignCategory(categoryId,dishId)
    }

    @Get('/category/get')
    async GetCategory(@GetUser() user: User):Promise<IngredientCategory[]>
    {
        return this.inventoryService.GetCategory(user)
    }
}
    

