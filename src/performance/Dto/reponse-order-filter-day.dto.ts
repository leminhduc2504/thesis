import { DishAnalysis, IngredientAnalysis } from "./order-analysis-.dto"

export class ReponseFilterOrderByDay{
    dates: string[] 
    amount: number[]
    profit: number[]
}

export class ResponseIngredientAnalysByDay{
    dates: string[]
    ingredientAnalys: IngredientAnalysis[][]

}

export class ResponseDishAnalysByDay{
    dates: string[]
    dishAnalys: DishAnalysis[][]
}

export class IngredientGraph{
    labels: string[]
    dataset: DatasetIngredient[]

}

export class DatasetIngredient{
    label: string
    data: number[]
    borderWidth: number
}