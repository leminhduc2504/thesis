import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { SupplierService } from 'src/supplier/supplier.service';
import { ChangeThresholdIngredientDto } from './Dto/change-threshold-ingredient.dto';
import { CreateIngredientDto } from './Dto/create-ingredient.dto';
import { CreateInvoiceDto } from './Dto/create-invoce.dto';
import { GetIngredientsFilterDto } from './Dto/get-ingredients-filter-dto';
import { Ingredient } from './Entity/ingredient.entity';
import { Invoice } from './Entity/invoice.entity';
import { IngredientRepository } from './ingredient.repository';
import { InvoiceRepository } from './invoce.repository';

@Injectable()
export class InventoryService {
    constructor(
        @InjectRepository(IngredientRepository)
        private inventoryRepository: IngredientRepository,

        @InjectRepository(InvoiceRepository)
        private invoiceRepository: InvoiceRepository,

        private supplierService: SupplierService
    ){}

    async GetIngredientsById(id: string): Promise<Ingredient>{
        return this.inventoryRepository.GetIngredientById(id)
    }

    async GetIngredients(filterDto: GetIngredientsFilterDto, user: User): Promise<Ingredient[]>{
        return this.inventoryRepository.GetIngredients(filterDto,user)
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

    async TakeIngredient(amount: number, ingredientId: string){
        return await this.inventoryRepository.ChangeStock(ingredientId,amount)
    }

    async SetSupplier(ingredientId: string , supplierDto : {supplierId: string}, user:User){
        
        return this.inventoryRepository.SetSupplier(ingredientId,await this.supplierService.GetSupplierById(supplierDto.supplierId),user)
    }

    async GetInvoice(user:User): Promise<Invoice[]>{
        return this.invoiceRepository.GetInvoice(user)
    }

    async CreateInvoice(createInvoiceDto: CreateInvoiceDto, user:User){
        const { ingredientId } = createInvoiceDto
        const ingredient = await this.GetIngredientsById(ingredientId)
        console.log(ingredient)
        if(ingredient.supplier == null){
            throw new BadRequestException("Please set supplier")
        }
        return this.invoiceRepository.CreateInvocie(createInvoiceDto, 
            ingredient,
            ingredient.supplier, 
            user)
    }
}
