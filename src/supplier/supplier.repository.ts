import { NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateSupplierDto } from "./Dto/create-supplier.dto";
import { PatchSupplierDto } from "./Dto/patch-supplier.dto";
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

    async PatchSupplier(id: string, patchSupplierDto: PatchSupplierDto, user:User){
        const {name, email,phone} =patchSupplierDto
        let found =await this.findOne({id,user})
        if(!found){
            throw new NotFoundException("Not found supplier")
        }
        if(name){
            found.name = name
        }
        if(phone){
            found.phoneNumber = phone
        }
        if(email){
            found.email = email
        }
        await this.save(found)
        
    }
}