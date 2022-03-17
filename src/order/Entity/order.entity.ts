import { User } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    status: OrderStatus

    @ManyToOne((_type) => User, user => user.orders, {eager:false})
    user:User
}



export const enum OrderStatus{
    open = "OPEN",
    processing = "PROCESSING",
    finished = "FINISHED"
}