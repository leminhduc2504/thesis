
export class CreateDishDto {
    name: string

    retailPrice: number

    ingredientPrice: number

    ingredientInfos!: DishIngredientInfo[]
    
}

export class DishIngredientInfo {
    ingredientId: string
    amount: number
}