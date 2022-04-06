import { ppid } from "process";
import { User } from "src/auth/user.entity";
import { FeedbackSummaryInstance } from "twilio/lib/rest/api/v2010/account/call/feedbackSummary";
import { Between, EntityRepository, MoreThan, Repository } from "typeorm";
import { CreateFeedbackDto } from "../Dto/create-feedback-dto";
import { DateFilterDto } from "../Dto/get-filter-dto";
import { FeedbackOverall, ReponseFeedbackDto } from "../Dto/reponse-feedback-dto";
import { Feedback } from "../Entity/feedback.entity";

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback>{

    async GetFeedback(filterDto:DateFilterDto, user:User): Promise<ReponseFeedbackDto>{
        const {start, end} = filterDto
        const query = this.createQueryBuilder('feedback')
        query.where({user})
        // const startC = new Date(start)
        // const endC = new Date(end)

        if(start && end){
            query.andWhere('feedback.createdAt BETWEEN :start AND :end', {start , end});
        }
        const feedbacks =await query.getMany()
        const reponse = new ReponseFeedbackDto()
        reponse.overall = new FeedbackOverall()
        reponse.feedbacks = feedbacks
        reponse.amount = feedbacks.length
        const total:Feedback = feedbacks.reduce((pre,cur)=>{
            cur.appetite += pre.appetite
            cur.overall += pre.overall
            cur.cleanliness += pre.cleanliness
            cur.facilities += pre.facilities
            cur.serviceTime += pre.serviceTime
            cur.valueForMoney += pre.valueForMoney
            cur.staff += pre.staff
            return cur
        })
        console.log(total)

        reponse.overall.overall = total.overall/reponse.amount
        reponse.overall.appetite = total.appetite/reponse.amount
        reponse.overall.cleanliness =  total.cleanliness/reponse.amount
        reponse.overall.facilities = total.facilities/reponse.amount
        reponse.overall.serviceTime= total.serviceTime/reponse.amount
        reponse.overall.staff = total.staff/reponse.amount
        reponse.overall.valueForMoney = total.valueForMoney/reponse.amount

        return reponse;
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