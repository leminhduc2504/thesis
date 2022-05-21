import { ConsoleLogger } from "@nestjs/common";
import { Dish } from "src/dish/Enitity/dish.entity";
import { EntityRepository, IsNull, Not, Repository } from "typeorm";
import { OrderDish } from "./Entity/order-dish.entity";
import { Order } from "./Entity/order.entity";

@EntityRepository(OrderDish)
export class OrderDishRepository extends Repository<OrderDish>{
    async GetOrderDishs(order_id: string){
        const found =await this.find({
            relations: ['order'],
            loadRelationIds: true,
            where:{
            cookingTime: Not(IsNull()),
            order : {orderId :order_id}}
        })
        return found;
    }

    async GetOrderDishsByDishId(dishId: string){
        const found =await this.find({
            relations: ['dish'],
            loadRelationIds: true,
            where:{
            dish : {id :dishId}}
        })
        return found;
    }


    async CraeteOrderDish(dish: Dish,amount: number, order: Order) {
        const newOrderDish = this.create({dish,amount,order})
        await this.save(newOrderDish)
        return "success"
    }

    async GetDishIdByOrderDishId(id: string): Promise<string>{
        const found =await this.findOne(id)
        return  found.dish.id
    }

    async PatchStartCookTime(id, createDto){
        const orderDish = await this.findOne(id)
        const {time} = createDto
        orderDish.startCook=time
        await this.save(orderDish)
    }

    async PatchFinishCookTime(id, createDto){
        const orderDish = await this.findOne(id)
        const {time} = createDto
        orderDish.finishCook = time
        const test1 = new Date(orderDish.finishCook)
        const test2 = new Date(orderDish.startCook)
        orderDish.cookingTime = this.IntToTime(+test1 - +test2)
        await this.save(orderDish)
    }

    IntToTime(e){
        e= e/1000
        var h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
        return h + ':' + m + ':' + s;
    }
}