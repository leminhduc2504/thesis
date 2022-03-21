import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateOrderDto } from './Dto/create-order.dto';
import { Order } from './Entity/order.entity';
import { OrderDishRepository } from './order-dish.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,

        @InjectRepository(OrderDishRepository)
        private orderDishRepository: OrderDishRepository
    ){}

    async GetOrders(user: User): Promise<Order[]>{
        return this.orderRepository.getOrders(user)
    }

    async CreateOrder(creatOrderDto: CreateOrderDto, user:User):Promise<Order>{
        return this.orderRepository.CreateOrder(creatOrderDto, user)
    }
}
