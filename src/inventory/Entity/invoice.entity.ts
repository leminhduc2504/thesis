import { User } from "src/auth/user.entity"
import { Ingredient, IngredientUnit } from "src/inventory/Entity/ingredient.entity"
import { AfterInsert, BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Supplier } from "../../supplier/Entity/supplier.entity"

@Entity()
export class Invoice{
    @PrimaryGeneratedColumn('uuid')
    invoceId : string

    @Column()
    status: InvoiceStatus = InvoiceStatus.opening

    @CreateDateColumn()
    createdAt: Date 

    @Column({nullable: true})
    deliveredAt: Date

    @Column({type: "decimal", precision: 6, scale: 2, nullable: true })
    invoicePrice: number

    @ManyToOne((_type) => User, user => user.invoices, {onDelete: 'CASCADE',eager:false })
    user:User

    @Column()
    amount: number

    @Column({nullable: true})
    unit: IngredientUnit

    @ManyToOne((_type) => Ingredient, ingredient => ingredient.invoices, {onDelete: 'SET NULL' ,eager:true})
    ingredient: Ingredient

    @ManyToOne((_type) => Supplier, supplier => supplier.invoices, {onDelete: 'SET NULL',eager:true })
    supplier: Supplier

    @BeforeInsert()
    GetCreateAt() {
        const d = new Date();
        // d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        this.createdAt = d
    }

}



export const enum InvoiceStatus{
    opening = "Openning",
    onDelivery = "On Delivery",
    finished = "Finished",
}