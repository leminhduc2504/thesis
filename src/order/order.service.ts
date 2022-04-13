import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DishService } from 'src/dish/dish.service';
import { CreateOrderDto, DishInfo } from './Dto/create-order.dto';
import { FilterGetOrderDto } from './Dto/filter-get-order.dto';
import { Order, OrderStatus } from './Entity/order.entity';
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

    async GetOrders(filter:FilterGetOrderDto, user: User): Promise<Order[]>{
        return this.orderRepository.GetOrders(filter,user)
    }

    async GetOrderById(id:number,user: User): Promise<Order>{
        return this.orderRepository.GetOrderById(id,user)
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

    async AcceptOrder(orderId: number ,user: User): Promise<Order>{
        const order =await this.GetOrderById(orderId,user)
        if(order.status == OrderStatus.open){
        order.status = OrderStatus.processing
        await this.orderRepository.save(order)
        order.acceptAt = this.GetTime()
        return order
        }
        else{
            throw new BadRequestException()
        }
    }

    async FinishOrder(orderId: number, user: User): Promise<Order>{
        const order = await this.GetOrderById(orderId,user)
        console.log(order)
        
        order.orderDishs.forEach( async (orderDish) => {
            console.log(orderDish)
            const dishId = await this.orderDishRepository.GetDishIdByOrderDishId(orderDish.orderDishId)
            this.dishService.TakeIngredient(orderDish.amount,dishId,user)
        })

        order.status = OrderStatus.finished
        order.fishedAt = this.GetTime()
        await this.orderRepository.save(order)
        order.orderDishs
        return order
    }

    async GetDishIdByOrderDishId(id:string):Promise<string>{
        return this.orderDishRepository.GetDishIdByOrderDishId(id)
    }

    GetTime():Date{
        const d = new Date();
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d
    }

    
}
