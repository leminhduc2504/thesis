import { User } from "src/auth/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Supplier{
    @PrimaryGeneratedColumn('uuid')
    id : string

    @Column()
    name: string

    @ManyToOne((_type) => User, user => user.suppliers, {eager:false})
    user:User
}