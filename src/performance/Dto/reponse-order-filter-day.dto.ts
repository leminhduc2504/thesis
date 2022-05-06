import { DishAnalysis, IngredientAnalysis } from "./order-analysis-.dto"

export class ReponseFilterOrderByDay{
    dates: string[] 
    amount: number[]
    profit: number[]
}

export class ReponseIngredientAnalysByDay{
    dates: string[]
    ingredientAnalys: IngredientAnalysis[]

}

export class ResponseDishAnalysByDay{
    dates: string[]
    dishAnalys: DishAnalysis[]
}
