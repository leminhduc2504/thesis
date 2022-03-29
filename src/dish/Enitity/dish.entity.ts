import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { OrderDish } from "src/order/Entity/order-dish.entity";
import { Order } from "src/order/Entity/order.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DishIngredient } from "./dish-ingredient.entity";

@Entity()
export class Dish{
    @PrimaryGeneratedColumn("increment")
    id : string

    @Column()
    name: string

    @Column("decimal", { precision: 5, scale: 2 })
    retailPrice: number = 0

    @Column("decimal", { precision: 5, scale: 2 })
    ingredientPrice: number = 0

    @OneToMany((_type) => DishIngredient, (dishIngredient) => dishIngredient.dish, {eager:true})
    dishIngredients: DishIngredient[]

    @OneToMany((_type) => OrderDish, (orderDish) => orderDish.dish)
    orderDishs: OrderDish[]

    // @ManyToOne((_type) => Order, order => order.dishs, {eager:false})
    // order:Order

    @ManyToOne((_type) => User, user => user.dishs, {eager:false,onDelete: 'CASCADE'})
    user:User
}