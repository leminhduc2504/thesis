import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity";

@Entity()
export class Unit{
    @PrimaryGeneratedColumn()
    id : string

    @Column({ unique: true})
    unit: string

    
}