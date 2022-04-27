import { Dish } from "src/dish/Enitity/dish.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderDish {
    @PrimaryGeneratedColumn('increment')
    orderDishId : string

    @Column({nullable: true })
    amount: number

    @ManyToOne((_type) => Dish, dish => dish.orderDishs, {eager:true,onDelete: 'CASCADE'})
    dish: Dish
    
    @ManyToOne((_type) => Order, order => order.orderDishs, {eager:false,onDelete: 'CASCADE'})
    order: Order

    @Column({nullable: true })
    startCook: Date

    @Column({nullable: true })
    finishCook: Date

    @Column({type: 'time', nullable: true})
    cookingTime: string
    
}