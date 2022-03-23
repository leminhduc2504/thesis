export class CreateOrderDto {

    price: number

    dishInfos!: DishInfo[]
    
}

export class DishInfo {
    dishId: string
    amount: number
}