import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateSupplierDto } from './Dto/create-supplier.dto';
import { Supplier } from './Entity/supplier.entity';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierRepository)
        private supplierRepository: SupplierRepository
    ){}

    async GetSuppliers(user: User): Promise<Supplier[]>{
        return this.supplierRepository.getSuppliers(user)
    }

    async CreateSupplier(createSupplierDto:CreateSupplierDto, user:User):Promise<Supplier>{
        return this.supplierRepository.CreateSupplier(createSupplierDto, user)
    }

}
