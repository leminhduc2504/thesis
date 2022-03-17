import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateSupplierDto } from "./Dto/create-supplier.dto";
import { Supplier } from "./Entity/supplier.entity";

@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier>{
    async getSuppliers(user: User): Promise<Supplier[]>{
        const query = this.createQueryBuilder('supplier')
        query.where({user})
        const suppliers =await query.getMany()
        
        return suppliers;
    }

    async CreateSupplier(createSupplier: CreateSupplierDto, user: User): Promise<Supplier>{
        const {name} = createSupplier

        const newIngredient = this.create({name,user})
        await this.save(newIngredient)
        return newIngredient
    }
}