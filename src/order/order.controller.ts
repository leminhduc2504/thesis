import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateOrderDto } from './Dto/create-order.dto';
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
    async createOrder(
        @GetUser() user: User,
        @Body() creatOrderDto: CreateOrderDto,
        ): Promise<Order>{
        return this.orderService.CreateOrder(creatOrderDto,user)
    }
}
