import { Dish } from "src/dish/Enitity/dish.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderDish {
    @PrimaryGeneratedColumn('increment')
    orderDishId : string

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    amount: number

    @ManyToOne((_type) => Dish, dish => dish.orderDishs, {eager:false,onDelete: 'CASCADE'})
    dish: Dish
    
    @ManyToOne((_type) => Order, order => order.orderDishs, {eager:false,onDelete: 'CASCADE'})
    order: Order
}