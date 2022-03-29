import { User } from "src/auth/user.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "../../inventory/Entity/invoice.entity";

@Entity()
export class Supplier{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    name: string

    @Column({nullable: true})
    email: string

    @Column({nullable: true})
    phoneNumber: string

    @ManyToOne((_type) => User, user => user.suppliers, {eager:false})
    user:User

    @OneToMany( (_type) => Ingredient, (ingredient) => ingredient.supplier,{cascade:true})
    ingredients: Ingredient[]

    @OneToMany((_type) => Invoice, (invoice) => invoice.supplier)
    invoices: Invoice[]
}