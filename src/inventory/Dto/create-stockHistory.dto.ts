import { Ingredient } from "../Entity/ingredient.entity"

export class CreateStockChangeHistoryDto{

    note: string

    ingredient: Ingredient

    amount: number
}