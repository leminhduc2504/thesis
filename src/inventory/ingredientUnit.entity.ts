import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity";

@Entity()
export class Unit{
    @PrimaryGeneratedColumn()
    id : string

    @Column({ unique: true})
    unit: string

    @OneToMany(_type => Ingredient, (ingredient) => ingredient.unit )
    ingredient: Ingredient
}