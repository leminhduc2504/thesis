import { Dish } from "src/dish/Enitity/dish.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderDish {
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    amount: number

    @ManyToOne((_type) => Dish, dish => dish.orderDishs, {eager:false})
    dish: Dish
    
    @ManyToOne((_type) => Order, order => order.orderDishs, {eager:false})
    order: Order
}