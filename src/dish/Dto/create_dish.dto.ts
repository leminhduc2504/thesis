
export class CreateDishDto {
    name: string

    retail_price: number

    ingredient_price: number

    ingredient_infos!: DishIngredientInfo[]
    
}

export class DishIngredientInfo {
    ingredient_ids: string
    amount: number
}