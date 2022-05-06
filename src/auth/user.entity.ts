import { userInfo } from "os";
import { Dish } from "src/dish/Enitity/dish.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { Order } from "src/order/Entity/order.entity";
import { Invoice } from "src/inventory/Entity/invoice.entity";
import { Supplier } from "src/supplier/Entity/supplier.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Feedback } from "src/performance/Entity/feedback.entity";
import { StockChangeHistory } from "src/inventory/Entity/history-change.entity";
import { DishCategory } from "src/dish/Enitity/dish-category.entity";
import { IngredientCategory } from "src/inventory/Entity/ingredient-category.entity";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ unique: true})
    username: string

    @Column({ nullable: true})
    firstname: string

    @Column({ nullable: true})
    lastname: string

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

    @OneToMany((_type) => StockChangeHistory, (stockChangeHistory) => stockChangeHistory.user)
    stockChangeHistory: StockChangeHistory[]

    @OneToMany((_type) => Feedback, (feedback) => feedback.user)
    feedbacks: Feedback[]

    @OneToMany((_type) => DishCategory, (dishCategory) => dishCategory.user)
    dishCategories: DishCategory[]

    @OneToMany((_type) => IngredientCategory, (ingredientCategory) => ingredientCategory.user)
    ingredientCategories: IngredientCategory[]

}