import { User } from "src/auth/user.entity";
import { Column, Entity,  ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Dish } from "./dish.entity";

@Entity()
export class DishCategory{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({nullable: false})
    name: string

    @OneToMany((_type) => Dish, (dish) => dish.dishCategory,{eager:true})
    dishs: Dish[]

    @ManyToOne((_type) => User, user => user.dishCategories, {onDelete: 'CASCADE'})
    user:User
}