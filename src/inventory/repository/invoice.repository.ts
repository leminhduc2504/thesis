import { User } from "src/auth/user.entity";
import { Ingredient } from "src/inventory/Entity/ingredient.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateInvoiceDto } from "../Dto/create-invoce.dto";
import { Invoice, InvoiceStatus } from "../Entity/invoice.entity";
import { Supplier } from "../../supplier/Entity/supplier.entity";
import { NotFoundException } from "@nestjs/common";

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice>{
    async GetInvoiceById(id: string ): Promise<Invoice> {
        const found = this.findOne(id)
        if(!found){
            throw new NotFoundException(`Invoice with id '${id}' not found`)
        }
        return found
    }

    async GetInvoice(user: User): Promise<Invoice[]>{
        const query = this.createQueryBuilder('invoice')
        query.where({user})
        .leftJoinAndSelect("invoice.ingredient","ingredient")
        .leftJoinAndSelect("invoice.supplier", "supplier")
        .orderBy("createdAt", "DESC")
        const invoices =await query.getMany()
        
        return invoices;
    }

    async CreateInvocie(createInvoiceDto: CreateInvoiceDto,ingredient:Ingredient, supplier: Supplier, user: User): Promise<Invoice>{
        const{unit, invoicePrice, amount } = createInvoiceDto

        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - createdAt.getTimezoneOffset() / 60);

        const newInvoice = this.create({createdAt,user,unit,invoicePrice,amount,ingredient,supplier})
        await this.save(newInvoice)
        return newInvoice
    }

    async AcceptInvoice(invoceId: string, user: User){
        const deliveredAt = new Date();
        deliveredAt.setHours(deliveredAt.getHours() - deliveredAt.getTimezoneOffset() / 60);
        const invoice = await this.findOne({invoceId, user})
        invoice.status = InvoiceStatus.finished
        invoice.deliveredAt =deliveredAt 
        await this.save(invoice)
    }
}