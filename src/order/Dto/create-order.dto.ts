export class CreateOrderDto {

    price: number

    ingredientInfos!: DishIngredientInfo[]
    
}

export class DishIngredientInfo {
    DishIngredientId: string
    amount: number
}