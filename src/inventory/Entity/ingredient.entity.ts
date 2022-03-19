import { User } from "src/auth/user.entity";
import { DishIngredient } from "src/dish/Enitity/dish-ingredient.entity";
import { Column, Entity, Exclusion, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ingredient{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    name: string

    @Column()
    stock: number

    @Column()
    highThreshold: number = 100

    @Column()
    lowThreshold: number = 10


    @ManyToOne((_type) => User, user => user.ingredients, {eager:false})
    user:User

    @OneToMany((_type) => DishIngredient, (dish_ingredient) => dish_ingredient.ingredient, {eager:true})
    dish_ingredients: DishIngredient[]

    // @Column()
    // unit: IngredientUnit = IngredientUnit.kilogram

}

export const enum IngredientUnit{
    kilogram = "kg",
    piece = "piece",
}