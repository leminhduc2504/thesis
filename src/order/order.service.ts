import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DishService } from 'src/dish/dish.service';
import { CreateOrderDto, DishInfo } from './Dto/create-order.dto';
import { Order } from './Entity/order.entity';
import { OrderDishRepository } from './order-dish.repository';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,

        @InjectRepository(OrderDishRepository)
        private orderDishRepository: OrderDishRepository,

        private dishService: DishService
    ){}

    async GetOrders(user: User): Promise<Order[]>{
        return this.orderRepository.getOrders(user)
    }

    async CreateListOrderDish(dishInfos: DishInfo[], order:Order){
        for (let i = 0; i < dishInfos.length; i++) {
            this.orderDishRepository.CraeteOrderDish(
                await this.dishService.GetDishById(dishInfos[i].dishId),
                dishInfos[i].amount,
                order)
        }
    }

    async CreateOrder(createOrderDto:CreateOrderDto, user:User):Promise<Order>{
        const {price, dishInfos} = createOrderDto
        const newOrder =await this.orderRepository.CreateOrder(price, user)
        await this.CreateListOrderDish(dishInfos, newOrder)
        return newOrder
    }
}
