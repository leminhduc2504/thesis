import { Ingredient } from "src/inventory/Entity/ingredient.entity"

export class CreateDishDto {
    name: string

    ingredient_infos!: DishIngredientInfo[]
    
}

export class DishIngredientInfo {
    ingredient_ids: string
    amount: number
}