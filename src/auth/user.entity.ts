import { userInfo } from "os";
import { Ingredient } from "src/inventory/entity/ingredient.entity";
import { Order } from "src/order/Entity/order.entity";
import { Supplier } from "src/supplier/Entity/supplier.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ unique: true})
    username: string

    @Column()
    password: string

    @OneToMany((_type) => Ingredient, (ingredient) => ingredient.user, {eager:true})
    ingredients: Ingredient[]

    @OneToMany((_type) => Supplier, (supplier) => supplier.user, {eager:true})
    suppliers: Supplier[]

    @OneToMany((_type) => Order, (order) => order.user, {eager:true})
    orders: Order[]

}