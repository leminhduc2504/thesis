import { User } from "src/auth/user.entity";
import { Order } from "src/order/Entity/order.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DishIngredient } from "./dish-ingredient.entity";

@Entity()
export class Dish{
    @PrimaryGeneratedColumn("increment")
    id : string

    @Column()
    name: string

    @OneToMany((_type) => DishIngredient, (dish_ingredient) => dish_ingredient.dish, {eager:true})
    dish_ingredients: DishIngredient[]

    // @ManyToOne((_type) => Order, order => order.dishs, {eager:false})
    // order:Order

    @ManyToOne((_type) => User, user => user.dishs, {eager:false})
    user:User
}