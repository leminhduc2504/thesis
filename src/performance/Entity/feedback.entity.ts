import { User } from "src/auth/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Feedback{
    @PrimaryGeneratedColumn('uuid')
    feedbackId : string

    @Column({nullable:true})
    email: string

    @CreateDateColumn({nullable: true} )
    createdAt: Date 
    
    @Column()
    overall: number 

    @Column({nullable:true})
    staff: number 

    @Column({nullable:true})
    cleanliness: number 

    @Column({nullable:true})
    facilities: number 

    @Column({nullable:true})
    valueForMoney: number 

    @Column({nullable:true})
    appetite : number

    @Column({nullable:true})
    serviceTime : number

    @ManyToOne((_type) => User, user => user.feedbacks, {eager:false})
    user:User

    @BeforeInsert()
    GetCreateAt() {
        const d = new Date();
        // d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
        this.createdAt = d
    }
}