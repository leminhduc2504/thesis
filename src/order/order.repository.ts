import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { FilterGetOrderDto } from "./Dto/filter-get-order.dto";
import { Order, OrderStatus } from "./Entity/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    async GetOrders(filter: FilterGetOrderDto, user: User): Promise<Order[]>{
        // const query = this.createQueryBuilder('order')
        // .leftJoinAndSelect("order.orderDish","orderDish")
        // .leftJoinAndSelect("orderDish.dish", "dish")
        // query.where({user})
        // const orders =await query.getMany()

        const {status} = filter
        const query = this.createQueryBuilder('order')
        .leftJoinAndSelect("order.orderDishs","orderDishs")
        .leftJoinAndSelect("orderDishs.dish", "dish")
        query.where({user})

        if(status){
            query.andWhere('order.status = :status',{status})
        }
        
        const orders = query.getMany()
        // if(!orders){
        //     throw new NotFoundException()
        // }
        return orders;
    }

    async GetOrderById(orderId:number ,user: User): Promise<Order>{
    
        const foundOrder = await this.findOne({where:{orderId,user}})
        if(!foundOrder){
            throw new NotFoundException()
        }
        return foundOrder;
    }

    async CreateOrder(orderPrice: number ,user: User): Promise<Order>{
        const newOrder = this.create({orderPrice, status: OrderStatus.open,user})
        await this.save(newOrder)
        return newOrder
    }

    // async AcceptOrder(orderId: number, user: User){    
    //     const order = await this.findOne({orderId,user})
    //     order.status = OrderStatus.processing
    //     await this.save(order)
    // }
    // async FinishOrder(orderId: number, user: User){
    //     const order = await this.findOne({orderId,user})
    //     order.status = OrderStatus.finished
    //     await this.save(order)
    // }
}