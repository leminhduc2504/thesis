import { BadRequestException,  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { User } from 'src/auth/user.entity';
import { CreateDishCategoryDto } from 'src/dish/Dto/create-dish-category.dto';
import { DateFilterDto } from 'src/performance/Dto/get-filter-dto';
import { SupplierService } from 'src/supplier/supplier.service';
import { ChangeIngredientDto } from './Dto/change-ingredient.dto';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { CreateInvoiceDto } from './Dto/create-invoce.dto';
import { CreateStockChangeHistoryDto } from './Dto/create-stockHistory.dto';
import { GetIngredientsFilterDto } from './Dto/get-ingredients-filter-dto';
import { IngredientCategory } from './Entity/ingredient-category.entity';
import { Ingredient } from './Entity/ingredient.entity';
import { Invoice } from './Entity/invoice.entity';
import { StockChangeHistoryRepository } from './repository/history-change.repository';
import { IngredientCategoryRepository } from './repository/ingredient-category.repository';
import { IngredientRepository } from './repository/ingredient.repository';
import { InvoiceRepository } from './repository/invoice.repository';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(IngredientRepository)
        private inventoryRepository: IngredientRepository,

        @InjectRepository(InvoiceRepository)
        private invoiceRepository: InvoiceRepository,

        @InjectRepository(StockChangeHistoryRepository)
        private stockChangeHistoryRepository: StockChangeHistoryRepository,

        @InjectRepository(IngredientCategoryRepository)
        private ingredientCategoryRepository: IngredientCategoryRepository,

        private supplierService: SupplierService,

        @InjectTwilio() private readonly client: TwilioClient
    ){}

    async GetIngredientsById(id: string): Promise<Ingredient>{
        return this.inventoryRepository.GetIngredientById(id)
    }

    async GetIngredients(filterDto: GetIngredientsFilterDto, user: User): Promise<Ingredient[]>{
        return this.inventoryRepository.GetIngredients(filterDto,user)
    }

    async GetAllIngredient(user){
        return this.inventoryRepository.GetAllIngredients(user)
    }

    async CreateIngredient(createIngredientDto:CreateIngredientDto, user:User):Promise<string>{
        return this.inventoryRepository.CreateIngredient(createIngredientDto, user)
    }

    async DeleteIngredient(id : string,user:User) : Promise<void>{
        return this.inventoryRepository.DeleteIngredient(id,user)

    }

    async ChangeThresholdIngredient(id:string, changeThresholdIngredientDto:ChangeThresholdIngredientDto):Promise<Ingredient>{
        return this.inventoryRepository.ChangeThreshold(id,changeThresholdIngredientDto)
    }

    async ChangeIngredientStock(amount: number, ingredientId: string){
        return await this.inventoryRepository.ChangeIngredientStock(ingredientId,amount)
    }

    async PatchIngredientStock(stock: number, ingredientId: string){
        return this.inventoryRepository.PatchIngredientStock(stock,ingredientId)
    }

    async SetSupplier(ingredientId: string , supplierDto : {supplierId: string}, user:User){
        
        return this.inventoryRepository.SetSupplier(ingredientId,await this.supplierService.GetSupplierById(supplierDto.supplierId),user)
    }

    async GetInvoice(user:User): Promise<Invoice[]>{
        return this.invoiceRepository.GetInvoice(user)
    }

    async CreateInvoice(createInvoiceDto: CreateInvoiceDto, user:User){
        const { ingredientId,amount, invoicePrice, unit } = createInvoiceDto
        const ingredient = await this.GetIngredientsById(ingredientId)
        if(ingredient.supplier == null){
            throw new BadRequestException("Please set supplier")
        }
        else{
            try{
                await this.sendSMS(ingredient.supplier.phoneNumber,amount,ingredient,user)
                return this.invoiceRepository.CreateInvocie(createInvoiceDto, 
                    ingredient,
                    ingredient.supplier, 
                    user)
            }
            catch(e){
                throw e
            }
        }
        
    }

    async DeliveryInvoice(invoiceId: string, user:User){
        return this.invoiceRepository.DeliveryInvoice(invoiceId,user)
    }

    async AcceptInvoice(invoiceId: string, user:User){
        try{
            this.invoiceRepository.AcceptInvoice(invoiceId, user)
            const invoice =  await this.invoiceRepository.GetInvoiceById(invoiceId)
            const note = "accept invoice"
            const ingredient = invoice.ingredient
            const amount = invoice.amount
            await this.ChangeIngredientStock(amount,ingredient.id)
            const createDto: CreateStockChangeHistoryDto = {note,ingredient,amount}
            this.CreateStockChange(createDto,user)
        }
        catch{
            throw new BadRequestException()
        }
    }

    async GetStockChangeHistory(user:User){
        return this.stockChangeHistoryRepository.GetStockChangeHistory(user)
    }

    async CreateStockChange(createDto : CreateStockChangeHistoryDto,user:User){
        return this.stockChangeHistoryRepository.CreateStockHistory(createDto,user)
    }

    async sendSMS(supplierPhone: string, amount: number, ingredient: Ingredient, user: User) {
        try {
            this.client.validationRequests
            .create({friendlyName: 'My Home Phone Number', phoneNumber:supplierPhone})
            .then(validation_request => console.log(validation_request.friendlyName));
          return await this.client.messages.create({
            body: 'Order request from: ' +user.username + " - Ingredient: " + ingredient.name + " - Amount: " + amount + " " + ingredient.unit,
            from: "+19892678221",
            to: "+" + supplierPhone,
          });
        } catch (e) {
            console.log(e)
          return e;
        }
    }

    // async AutoRefill(amount: number, ingredientId: string){
    //     const ingredient = this.inventoryRepository.GetIngredientById(ingredientId)
    // }

    // async SetAutoRefill(ingredientId: string, amount: number, threshold: number, user: User){
    //     return this.inventoryRepository.SetAutoRefill(ingredientId,amount,threshold,user)
    // }

    // async TurnOnAutoRefill(ingredientId: string, user: User){
    //     return this.inventoryRepository.TurnOnAutoRefill(ingredientId,user)
    // }
    
    async CreateCategory(createDishCategoryDto:CreateDishCategoryDto,user: User){
        const {categoryName} =createDishCategoryDto
        
        return await this.ingredientCategoryRepository.CreateIngredientCategory(categoryName,user)
    }

    async AssignCategory(categoryId:string, ingredientId:string){
        const category =await this.ingredientCategoryRepository.GetCategoryById(categoryId)
        return await this.inventoryRepository.AssignCategory(ingredientId,category)
    
    }

    async GetCategory(user:User): Promise<IngredientCategory[]>{
        return await this.ingredientCategoryRepository.GetAllCategory(user)
    }
    
    async PatchIngredient(user: User,ingredientId: string, changeIngredientDto: ChangeIngredientDto){
        const {name, stock, priceEach, lowThreshold,unit, supplierId,ingredientCategoryId} = changeIngredientDto
        if(stock){
            try{
                const amount = await this.inventoryRepository.PatchIngredientStock(stock, ingredientId)
                if(amount != 0.00){
                    const ingredient = await this.GetIngredientsById(ingredientId)
                    await this.stockChangeHistoryRepository.CreateStockHistory({note:"change stock",amount,ingredient},user)
                }
            }
            catch{}
        }
        if(supplierId){
            await this.SetSupplier(ingredientId, {supplierId}, user)
        }
        if(ingredientCategoryId){
            await this.AssignCategory(ingredientCategoryId,ingredientId)
        }
        if(unit || name || priceEach || lowThreshold){
            await this.inventoryRepository.PatchIngredient(user, ingredientId, name, priceEach, lowThreshold, unit)
        }
            
    }

    async  GetStockChangeHistoryByUserByDay(filter: DateFilterDto, user: User){
        const found = this.stockChangeHistoryRepository.GetStockChangeHistoryByUserByDay(filter,user)
        
    }

    
}
