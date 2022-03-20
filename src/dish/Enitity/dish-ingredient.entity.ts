import { Ingredient, IngredientUnit } from "src/inventory/Entity/ingredient.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "./dish.entity";

@Entity()
export class DishIngredient{
    @PrimaryGeneratedColumn('increment')
    id : string

    @ManyToOne((_type) => Ingredient, ingredient => ingredient.dishIngredients, {eager:false})
    ingredient: Ingredient
 
    @ManyToOne((_type) => Dish, dish => dish.dishIngredients, {eager:false})
    dish: Dish
    
    @Column()
    amount: number = 0

    @Column()
    unit: IngredientUnit = IngredientUnit.kilogram

}