import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateOrderDto } from './Dto/create-order.dto';
import { FilterGetOrderDto } from './Dto/filter-get-order.dto';
import { Order, OrderStatus } from './Entity/order.entity';
import { OrderService } from './order.service';

@Controller('order')
@UseGuards(AuthGuard())
export class OrderController {
    constructor(
        private orderService: OrderService
    ){}

    @Get()
    async getOrders(
    @Query() filter : FilterGetOrderDto,
    @GetUser() user: User
    ): Promise<Order[]>{
        return this.orderService.GetOrders(filter,user)
    }

    @Get("/:id")
    async GetOrderById(
        @Param('id') orderId: number,
        @GetUser() user: User
    ){
        return this.orderService.GetOrderById(orderId,user);
    }
    @Post()
    async createOrder(
        @GetUser() user: User,
        @Body() creatOrderDto: CreateOrderDto,
        ): Promise<Order>{
        return this.orderService.CreateOrder(creatOrderDto,user)
    }

    @Patch("/accept_order/:id")
    async acceptOrder(@GetUser() user: User,@Param('id') id: number): Promise<Order>{
        return this.orderService.AcceptOrder(id,user)
    }

    @Patch("/finish_order/:id")
    async finishOrder(@GetUser() user: User,@Param('id') id: number): Promise<Order>{
        return this.orderService.FinishOrder(id,user)
    }

    @Patch("start/:orderDishId")
    async PatchStartCookTime(@Param('orderDishId') id: number, @Body() createDto: {time: Date}){
        return this.orderService.PatchStartCookTime(id, createDto)
    }
    @Patch("end/:orderDishId")
    async PatchFinishCookTime(@Param('orderDishId') id: number, @Body() createDto: {time: Date}){
        return this.orderService.PatchFinishCookTime(id, createDto)
    }
}
