import { Dish } from "src/dish/Enitity/dish.entity"
import { Ingredient } from "src/inventory/Entity/ingredient.entity"

export class OrderAnalysis{
    amount: number
    retailPrice: number
    ingredientPrice: number
    dishs : DishAnalysis[]
    ingredients: IngredientAnalysis[]
}

export class DishAnalysis{
    dishId: string
    amount: number
}

export class IngredientAnalysis{
    ingredientId: string
    amount: number
}