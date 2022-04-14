import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { FilterGetOrderDto } from "./Dto/filter-get-order.dto";
import { OrderDish } from "./Entity/order-dish.entity";
import { Order, OrderStatus } from "./Entity/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    async GetOrders(filter: FilterGetOrderDto, user: User): Promise<Order[]>{
        // const query = this.createQueryBuilder('order')
        // .leftJoinAndSelect("order.orderDish","orderDish")
        // .leftJoinAndSelect("orderDish.dish", "dish")
        // query.where({user})
        // const orders =await query.getMany()

        const {status,start,end} = filter
        const query = this.createQueryBuilder('order')
        .leftJoinAndSelect("order.orderDishs","orderDishs")
        .leftJoinAndSelect("orderDishs.dish", "dish")
        query.where({user})

        if(status){
            query.andWhere('order.status = :status',{status})
        }
        // console.log(start,end)
        if(start && end){
            query.andWhere('order.createdAt BETWEEN :start AND :end', {start , end});
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

    async GetOrderDishById(orderId:number ,user: User): Promise<OrderDish[]>{
    
        const foundOrder = await this.findOne({where:{orderId,user}})
        if(!foundOrder){
            throw new NotFoundException()
        }
        return foundOrder.orderDishs;
    }

    async CreateOrder(orderPrice: number ,user: User): Promise<Order>{
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - createdAt.getTimezoneOffset() / 60);
        const newOrder = this.create({createdAt,orderPrice, status: OrderStatus.open,user})
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