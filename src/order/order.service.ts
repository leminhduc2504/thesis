import { BadRequestException, ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { DishService } from 'src/dish/dish.service';
import { CreateOrderDto, DishInfo } from './Dto/create-order.dto';
import { FilterGetOrderDto } from './Dto/filter-get-order.dto';
import { OrderDish } from './Entity/order-dish.entity';
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

    async GetOrderDishById(id:number,user: User): Promise<OrderDish[]>{
        return this.orderRepository.GetOrderDishById(id,user)
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
        // order.acceptAt = this.GetTime()
        order.acceptAt = new Date()
        await this.orderRepository.save(order)
        return order
        }
        else{
            throw new BadRequestException()
        }
    }

    async FinishOrder(orderId: number, user: User): Promise<Order>{
        const order = await this.GetOrderById(orderId,user)

        for(let i = 0; i < order.orderDishs.length; i++){
            const dishId = await this.orderDishRepository.GetDishIdByOrderDishId(order.orderDishs[i].orderDishId)
            await this.dishService.TakeIngredient(order.orderDishs[i].amount,dishId,user)
        }

        // order.orderDishs.forEach( async (orderDish) => {
        //     const dishId = await this.orderDishRepository.GetDishIdByOrderDishId(orderDish.orderDishId)
        //     await this.dishService.TakeIngredient(orderDish.amount,dishId,user)
        // })

        order.status = OrderStatus.finished
        // order.fishedAt = this.GetTime()
        order.fishedAt = new Date()
        order.cookingTime = this.IntToTime(+order.fishedAt - +order.acceptAt)
        await this.orderRepository.save(order)
        return order
    }

    async GetDishIdByOrderDishId(id:string):Promise<string>{
        return this.orderDishRepository.GetDishIdByOrderDishId(id)
    }

    async PatchStartCookTime(id, createDto){
        return this.orderDishRepository.PatchStartCookTime(id, createDto)
    }

    async PatchFinishCookTime(id, createDto){
        return this.orderDishRepository.PatchFinishCookTime(id, createDto)
    }



    GetTime():Date{
        const d = new Date();
        d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        return d
    }

    IntToTime(e){
        e= e/1000
        var h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
        return h + ':' + m + ':' + s;
    }
}
