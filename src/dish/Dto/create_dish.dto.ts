
export class CreateDishDto {
    name: string

    retailPrice: number

    estimatedCookingTime: string

    ingredientPrice: number

    ingredientInfos!: DishIngredientInfo[]
    
}

export class DishIngredientInfo {
    ingredientId: string
    amount: number
}