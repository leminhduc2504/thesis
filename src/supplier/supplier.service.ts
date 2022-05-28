import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateSupplierDto } from './Dto/create-supplier.dto';
import { PatchSupplierDto } from './Dto/patch-supplier.dto';
import { Supplier } from './Entity/supplier.entity';
import { SupplierRepository } from './supplier.repository';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(SupplierRepository)
        private supplierRepository: SupplierRepository,

    ){}

    async GetSupplierById(id: string): Promise<Supplier>{
        return this.supplierRepository.GetSupplierById(id)
    }

    async GetSuppliers(user: User): Promise<Supplier[]>{
        return this.supplierRepository.GetSuppliers(user)
    }

    async CreateSupplier(createSupplierDto:CreateSupplierDto, user:User):Promise<Supplier>{
        return this.supplierRepository.CreateSupplier(createSupplierDto, user)
    }

    async PatchSupplier(id: string,patchSupplierDto: PatchSupplierDto, user:User){
        return this.supplierRepository.PatchSupplier(id,patchSupplierDto,user)
    }

}
