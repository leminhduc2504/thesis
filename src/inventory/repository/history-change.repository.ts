import { User } from "src/auth/user.entity";
import { DateFilterDto } from "src/performance/Dto/get-filter-dto";
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

    async GetStockChangeHistoryByUserByDay(filter: DateFilterDto, user: User){
        const{start,end} = filter
        const start_ = new Date(start)
        const end_ = new Date(end)
        end_.setHours(end_.getHours() +24);
        const query = this.createQueryBuilder('stock-change')
        .leftJoinAndSelect("stock-change.ingredient","ingredient")
        .where({user})
        .andWhere('stock-change.note =:note', {note :"change stock"})
        if(start && end){
            query.andWhere('stock-change.createdAt BETWEEN :start_ AND :end_', {start_ , end_});
        }
        const stockChanges = query.getMany()
        return stockChanges;
    }

    async CreateStockHistory(createDto: CreateStockChangeHistoryDto,user:User){
        const {note,ingredient,amount} = createDto

        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - createdAt.getTimezoneOffset() / 60);
        
        const stockChange = this.create({createdAt,note,ingredient,amount,user})
        await this.save(stockChange)
        return stockChange
    }


}