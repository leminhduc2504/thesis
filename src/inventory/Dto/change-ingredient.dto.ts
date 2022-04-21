import { IngredientUnit } from "../Entity/ingredient.entity"

export class ChangeIngredientDto{
    name: string

    stock: number

    priceEach: number = 0

    lowThreshold: number = 10

    unit : IngredientUnit

    supplierId: string

    ingredientCategoryId: string
}