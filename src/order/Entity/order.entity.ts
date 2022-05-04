import { Exclude } from "class-transformer";
import { timestamp } from "rxjs";
import { User } from "src/auth/user.entity";
import { Dish } from "src/dish/Enitity/dish.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderDish } from "./order-dish.entity";

@Entity()
export class Order{
    @PrimaryGeneratedColumn('increment')
    orderId : number

    @Column()
    status: OrderStatus

    // @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" } )
    // createdAt!: Date 

    @CreateDateColumn({nullable: true} )
    createdAt: Date = null

    @Column({nullable: true})
    acceptAt: Date = null

    @Column({nullable: true})
    fishedAt: Date = null

    @Column({type: "decimal", precision: 6, scale: 2, nullable: true })
    orderPrice: number

    // @Column({type: "decimal", precision: 6, scale: 2, nullable: true })
    // ingredientPrice: number

    @ManyToOne((_type) => User, user => user.orders, {eager:false,onDelete: 'CASCADE' })
    user:User

    @OneToMany((_type) => OrderDish, (orderDish) => orderDish.order, {eager:true})
    orderDishs: OrderDish[]

    @Column({type: 'time', nullable: true})
    estimatedTime: string

    @Column({type: 'time', nullable: true})
    cookingTime: string
}



export const enum OrderStatus{
    open = "OPEN",
    processing = "PROCESSING",
    finished = "FINISHED"
}