import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./ingredientUnit.entity";

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
    lowThreshold: number = 0

    @ManyToOne(_type => Unit, (unit) => unit.ingredient )
    unit: Unit

    
}