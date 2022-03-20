import { User } from "src/auth/user.entity";
import { Dish } from "src/dish/Enitity/dish.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDish } from "./order-dish.entity";

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    status: OrderStatus

    @ManyToOne((_type) => User, user => user.orders, {eager:false})
    user:User

    @OneToMany((_type) => OrderDish, (orderDish) => orderDish.order, {eager:true})
    orderDishs: OrderDish[]

}



export const enum OrderStatus{
    open = "OPEN",
    processing = "PROCESSING",
    finished = "FINISHED"
}