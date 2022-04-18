import { User } from "src/auth/user.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Ingredient } from "./ingredient.entity"

@Entity()
export class IngredientCategory{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({nullable: false})
    name: string

    @OneToMany((_type) => Ingredient, (ingredients) => ingredients.ingredientCategory)
    ingredients: Ingredient[]

    @ManyToOne((_type) => User, user => user.ingredientCategories, {onDelete: 'CASCADE'})
    user:User
}