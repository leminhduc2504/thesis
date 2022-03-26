import { Exclude } from "class-transformer";
import { User } from "src/auth/user.entity";
import { DishIngredient } from "src/dish/Enitity/dish-ingredient.entity";
import { Supplier } from "src/supplier/Entity/supplier.entity";
import { AfterUpdate, Column, Entity, Exclusion, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne((_type) => Supplier, supplier => supplier.ingredients, {eager:false})
    supplier?: Supplier

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    onDilivery: number

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    autoOrderAmount: number

    @Column()
    unit : IngredientUnit = IngredientUnit.kilogram

}

export const enum IngredientUnit{
    kilogram = "kg",
    piece = "piece",
}