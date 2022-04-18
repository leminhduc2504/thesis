import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { DishIngredient } from "src/dish/Enitity/dish-ingredient.entity";
import { Invoice } from "src/inventory/Entity/invoice.entity";
import { Supplier } from "src/supplier/Entity/supplier.entity";
import { AfterUpdate, Column, Entity, Exclusion, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockChangeHistory } from "./history-change.entity";
import { IngredientCategory } from "./ingredient-category.entity";

@Entity()
export class Ingredient{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    name: string

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    stock!: number

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    priceEach: number = 0

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    highThreshold: number = 100

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    lowThreshold: number = 10


    @ManyToOne((_type) => User, user => user.ingredients, {eager:false})
    user:User

    @OneToMany((_type) => DishIngredient, (dishIngredient) => dishIngredient.ingredient, {eager:false})
    dishIngredients: DishIngredient[]


    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    onDilivery: number

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    autoRefillAmount: number

    @Column()
    unit : IngredientUnit = IngredientUnit.kilogram

    @OneToMany((_type) => Invoice, (invoice) => invoice.ingredient)
    invoices: Invoice[]

    @OneToMany((_type) => StockChangeHistory, (stockChangeHistory) => stockChangeHistory.ingredient, {eager:false})
    stockChangeHistory: StockChangeHistory[]

    @ManyToOne((_type) => Supplier, supplier => supplier.ingredients, {eager:true} )
    supplier: Supplier

    @Column({nullable: true})
    autoRefillStatus: AutoRefillStatus = AutoRefillStatus.off

    @ManyToOne((_type) => IngredientCategory, (ingredientCategory) => ingredientCategory.ingredients, {onDelete:'SET NULL'})
    ingredientCategory: IngredientCategory

}

export const enum IngredientUnit{
    kilogram = "kg",
    piece = "piece",
}

export const enum AutoRefillStatus {
    on = "ON",
    off = "OFF"
}