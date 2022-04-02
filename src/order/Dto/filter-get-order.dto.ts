import { OrderStatus } from "../Entity/order.entity";

export class FilterGetOrderDto{
    status: OrderStatus
    start: Date
    end: Date
}