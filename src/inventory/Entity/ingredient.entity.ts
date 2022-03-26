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

    @Column()
    stock!: number

    @Column({nullable: true})
    priceEach: number = 0

    @Column()
    highThreshold: number = 100

    @Column()
    lowThreshold: number = 10


    @ManyToOne((_type) => User, user => user.ingredients, {eager:false})
    user:User

    @OneToMany((_type) => DishIngredient, (dishIngredient) => dishIngredient.ingredient, {eager:false})
    dishIngredients: DishIngredient[]

    @ManyToOne((_type) => Supplier, supplier => supplier.ingredients, {eager:false})
    supplier?: Supplier

    @Column({nullable:true})
    onDilivery: number

    @Column({nullable:true})
    autoOrderAmount: number

    @Column()
    unit : IngredientUnit = IngredientUnit.kilogram

}

export const enum IngredientUnit{
    kilogram = "kg",
    piece = "piece",
}