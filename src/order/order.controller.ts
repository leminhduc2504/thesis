import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Order } from './Entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AuthGuard())
export class OrderController {
    constructor(
        private orderService: OrderService
    ){}

    @Get()
    async getOrders(
    @GetUser() user: User
    ): Promise<Order[]>{
        return this.orderService.GetOrders(user)
    }

    @Post()
    async createIngredient(
        @GetUser() user: User
        ): Promise<Order>{
        return this.orderService.CreateOrder(user)
    }
}
