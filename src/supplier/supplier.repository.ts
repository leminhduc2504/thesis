import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateSupplierDto } from "./Dto/create-supplier.dto";
import { Supplier } from "./Entity/supplier.entity";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier>{
    async GetSupplierById(id: string): Promise<Supplier>{
        const found = this.findOne(id)
        if(!found){
            throw new NotFoundException(`Supplier with id '${id}' not found`)
        }
        return found
    }

    async GetSuppliers(user: User): Promise<Supplier[]>{
        const query = this.createQueryBuilder('supplier')
        query.where({user})
        const suppliers =await query.getMany()
        
        return suppliers;
    }

    async CreateSupplier(createSupplier: CreateSupplierDto, user: User): Promise<Supplier>{
        const {name,email,phoneNumber} = createSupplier

        const newSupplier = this.create({name,email,phoneNumber,user})
        await this.save(newSupplier)
        return newSupplier
    }
}