import { Dish } from "src/dish/Enitity/dish.entity"
import { Ingredient } from "src/inventory/Entity/ingredient.entity"

export class OrderAnalysis{
    orderAmount: number
    retailPrice: number = 0.00
    ingredientPrice: number = 0.00
    dishs : DishAnalysis[] =  new Array<DishAnalysis>()
    ingredients: IngredientAnalysis[] =  new Array<IngredientAnalysis>()
}

export class DishAnalysis{
    dish: Dish
    dishAmount: number = 0
}

export class IngredientAnalysis{
    ingredient: Ingredient
    ingredientAmount: number = 0
}