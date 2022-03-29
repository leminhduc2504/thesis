import { userInfo } from "os";
import { Dish } from "src/dish/Enitity/dish.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { Order } from "src/order/Entity/order.entity";
import { Invoice } from "src/inventory/Entity/invoice.entity";
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

    @OneToMany((_type) => Ingredient, (ingredient) => ingredient.user)
    ingredients: Ingredient[]

    @OneToMany((_type) => Supplier, (supplier) => supplier.user )
    suppliers: Supplier[]

    @OneToMany((_type) => Order, (order) => order.user )
    orders: Order[]

    @OneToMany((_type) => Dish, (dish) => dish.user)
    dishs: Dish[]

    @OneToMany((_type) => Invoice, (invoice) => invoice.user)
    invoices: Invoice[]


}