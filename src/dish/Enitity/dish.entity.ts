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

    @Column(({nullable: true,}))
    retail_price: number = 0

    @Column(({nullable: true,}))
    ingredient_price: number = 0

    @OneToMany((_type) => DishIngredient, (dish_ingredient) => dish_ingredient.dish, {eager:true})
    dish_ingredients: DishIngredient[]

    @OneToMany((_type) => OrderDish, (order_dish) => order_dish.dish, {eager:true})
    order_dishs: OrderDish[]

    // @ManyToOne((_type) => Order, order => order.dishs, {eager:false})
    // order:Order

    @ManyToOne((_type) => User, user => user.dishs, {eager:false})
    user:User
}