import { User } from "src/auth/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "./ingredient.entity";

@Entity()
export class StockChangeHistory{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @CreateDateColumn()
    createdAt: Date 

    @Column()
    note: string

    @ManyToOne((_type) => Ingredient, ingredient => ingredient.stockChangeHistory, {onDelete: 'CASCADE' ,eager:true})
    ingredient: Ingredient

    @ManyToOne((_type) => User, user => user.stockChangeHistory, {eager:false})
    user:User

    @Column({type: "decimal", precision: 5, scale: 2, nullable: true })
    amount: number
}