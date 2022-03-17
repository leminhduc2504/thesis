import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Order } from './Entity/order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository
    ){}

    async GetOrders(user: User): Promise<Order[]>{
        return this.orderRepository.getOrders(user)
    }

    async CreateOrder( user:User):Promise<Order>{
        return this.orderRepository.CreateOrder( user)
    }
}
