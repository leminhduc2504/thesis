import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { CreateStockChangeHistoryDto } from "../Dto/create-stockHistory.dto";
import { StockChangeHistory } from "../Entity/history-change.entity";

@EntityRepository(StockChangeHistory)
export class StockChangeHistoryRepository extends Repository<StockChangeHistory>{
    async GetStockChangeHistory(user: User){
        const query = this.createQueryBuilder('stockChangeHistory')
        .leftJoinAndSelect("stockChangeHistory.ingredient","ingredient")
        .where({user})
        .orderBy("createdAt", "DESC")
        
        const log =await query.getMany()
        
        return log; 
    }

    async CreateStockHistory(createDto: CreateStockChangeHistoryDto,user:User){
        const {note,ingredient,amount} = createDto
        const stockChange = this.create({note,ingredient,amount,user})
        await this.save(stockChange)
        return stockChange
    }
}