import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { FilterGetOrderDto } from "./Dto/filter-get-order.dto";
import { OrderDish } from "./Entity/order-dish.entity";
import { Order, OrderStatus } from "./Entity/order.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    async GetOrders(filter: FilterGetOrderDto, user: User): Promise<Order[]>{
        
        
        const {status,start,end} = filter

        const start_ = new Date(start)
        const end_ = new Date(end)
        end_.setHours(end_.getHours() +24);
        const query = this.createQueryBuilder('order')
        .leftJoinAndSelect("order.orderDishs","orderDishs")
        .leftJoinAndSelect("orderDishs.dish", "dish")
        query.where({user})

        if(status){
            query.andWhere('order.status = :status',{status})
        }
        if(start && end){
            query.andWhere('order.createdAt BETWEEN :start_ AND :end_', {start_ , end_});
        }
        query.orderBy("createdAt", "DESC")
        const orders = query.getMany()
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
        // createdAt.setHours(createdAt.getHours() - createdAt.getTimezoneOffset() / 60);
        const newOrder = this.create({createdAt,orderPrice, status: OrderStatus.open,user})
        await this.save(newOrder)
        return newOrder
    }
    
}