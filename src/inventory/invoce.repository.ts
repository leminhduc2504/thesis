import { User } from "src/auth/user.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateInvoiceDto } from "./Dto/create-invoce.dto";
import { Invoice } from "./Entity/invoice.entity";
import { Supplier } from "../supplier/Entity/supplier.entity";

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice>{
    async GetInvoice(user: User): Promise<Invoice[]>{
        const query = this.createQueryBuilder('invoice')
        query.where({user})
        const invoices =await query.getMany()
        
        return invoices;
    }

    async CreateInvocie(createInvoiceDto: CreateInvoiceDto,ingredient:Ingredient, supplier: Supplier, user: User): Promise<Invoice>{
        const{unit, invoicePrice, amount } = createInvoiceDto
        const newInvoice = this.create({user,unit,invoicePrice,amount,ingredient,supplier})
        await this.save(newInvoice)
        return newInvoice
    }
}