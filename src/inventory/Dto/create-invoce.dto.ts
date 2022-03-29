import { IngredientUnit } from "src/inventory/Entity/ingredient.entity"

export class CreateInvoiceDto {

    invoicePrice: number

    amount: number

    unit: IngredientUnit

    ingredientId: string
    
}