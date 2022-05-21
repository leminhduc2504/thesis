import { Dish } from "src/dish/Enitity/dish.entity";
import { OrderDish } from "src/order/Entity/order-dish.entity";

export class DishCookingPerformance{
    dish: Dish
    secondCookingTimeTotal :number
    cookingTimeEst: string
    cookingTimeAvr: string
    amount : number
    orderDish: OrderDish[]
}

  