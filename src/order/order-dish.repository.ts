import { Dish } from "src/dish/Enitity/dish.entity";
import { EntityRepository, Repository } from "typeorm";
import { OrderDish } from "./Entity/order-dish.entity";
import { Order } from "./Entity/order.entity";

@EntityRepository(OrderDish)
export class OrderDishRepository extends Repository<OrderDish>{
    async GetOrderDishs(order_id: string){

        const found =await this.find({
            relations: ['order'],
            loadRelationIds: true,
            where:{
            order : {id :order_id}}
            
        })
        
        return found;
    }


    async CraeteOrderDish(dish: Dish,amount: number, order: Order): Promise<string> {
        const newOrderDish= this.create({amount,dish,order})
        await this.save(newOrderDish)
        return "success"
    }
}