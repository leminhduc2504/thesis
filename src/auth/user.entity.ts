import { userInfo } from "os";
import { Ingredient } from "src/inventory/ingredient.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column({ unique: true})
    username: string

    @Column()
    password: string

    @OneToMany((_type) => Ingredient, (ingredient) => ingredient.user, {eager:true})
    ingredients: Ingredient[]

}