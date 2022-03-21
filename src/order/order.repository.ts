import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Order, OrderStatus } from "./Entity/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    async getOrders(user: User): Promise<Order[]>{
        const query = this.createQueryBuilder('orders')
        query.where({user})
        const orders =await query.getMany()
        return orders;
    }

    async CreateOrder(orderPrice ,user: User): Promise<Order>{
        const newOrder = this.create({orderPrice,status: OrderStatus.open,user})
        await this.save(newOrder)
        return newOrder
    }
}