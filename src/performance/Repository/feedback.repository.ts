import { ppid } from "process";
import { User } from "src/auth/user.entity";
import { Between, EntityRepository, MoreThan, Repository } from "typeorm";
import { CreateFeedbackDto } from "../Dto/create-feedback-dto";
import { FeedbackFilterDto } from "../Dto/get-filter-dto";
import { Feedback } from "../Entity/feedback.entity";

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback>{

    async GetFeedback(filterDto:FeedbackFilterDto, user:User): Promise<Feedback[]>{
        const {start, end} = filterDto
        const query = this.createQueryBuilder('feedback')
        query.where({user})
        const startC = new Date(start)
        const endC = new Date(end)

        if(startC && endC){
            query.andWhere('feedback.createdAt BETWEEN :startC AND :endC', {startC , endC});
        }
        const feedbacks =await query.getMany()
        return feedbacks;
    }

    async CreateFeedback( createFeedbackDto: CreateFeedbackDto,user:User): Promise<Feedback>{
        const {email, overall, staff, cleanliness, facilities, valueForMoney, appetite, serviceTime } = createFeedbackDto
        const newFeedback = this.create( {user, email, overall, staff, cleanliness, facilities, valueForMoney, appetite, serviceTime })
        await this.save(newFeedback)
        return newFeedback
    }

    // const test =new Date(start)
    //     const test2 = new Date(end)
    //     if()
    //     const feedbacks = await this.find({
    //         where: {
    //             user,
    //             createdAt: Between(test,test2) }

    //         })
        
}