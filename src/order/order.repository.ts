import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Order, OrderStatus } from "./Entity/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    async getOrders(user: User): Promise<Order[]>{
        // const query = this.createQueryBuilder('order')
        // .leftJoinAndSelect("order.orderDish","orderDish")
        // .leftJoinAndSelect("orderDish.dish", "dish")
        // query.where({user})
        // const orders =await query.getMany()

        const orders = this.find({user})
        return orders;
    }

    async CreateOrder(orderPrice ,user: User): Promise<Order>{
        const newOrder = this.create({orderPrice, status: OrderStatus.open,user})
        await this.save(newOrder)
        return newOrder
    }
}