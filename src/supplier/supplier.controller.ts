import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateSupplierDto } from './Dto/create-supplier.dto';
import { Supplier } from './Entity/supplier.entity';
import { SupplierService } from './supplier.service';

@Controller('supplier')
@UseGuards(AuthGuard())
export class SupplierController {
    constructor(
        private supplierService: SupplierService
    ){}

    @Get()
    async getIngredients(
    @GetUser() user: User
    ): Promise<Supplier[]>{
        return this.supplierService.GetSuppliers(user)
    }

    @Post()
    async createIngredient(
        @Body() createSupplierDto: CreateSupplierDto,
        @GetUser() user: User
        ): Promise<Supplier>{
        return this.supplierService.CreateSupplier(createSupplierDto,user)
    }


}
