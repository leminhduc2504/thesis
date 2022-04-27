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
        feedbacks.forEach(ele => {
            reponse.overall.overall += ele.overall
            reponse.overall.appetite += ele.appetite
            reponse.overall.cleanliness += ele.cleanliness
            reponse.overall.facilities +=ele.facilities
            reponse.overall.serviceTime += ele.serviceTime
            reponse.overall.staff += ele.staff
            reponse.overall.valueForMoney += ele.valueForMoney
        })
        
        // console.log(total)
        
        reponse.overall.overall = reponse.overall.overall/reponse.amount
        reponse.overall.appetite = reponse.overall.appetite/reponse.amount
        reponse.overall.cleanliness =  reponse.overall.cleanliness/reponse.amount
        reponse.overall.facilities = reponse.overall.facilities/reponse.amount
        reponse.overall.serviceTime= reponse.overall.serviceTime/reponse.amount
        reponse.overall.staff = reponse.overall.staff/reponse.amount
        reponse.overall.valueForMoney = reponse.overall.valueForMoney/reponse.amount

        return reponse;
    }

    async GetFeedbackList(filterDto:DateFilterDto, user:User): Promise<Feedback[]>{
        const {start, end} = filterDto
        const query = this.createQueryBuilder('feedback')
        query.where({user})
        const start_ = new Date(start)
        const end_ = new Date(end)
        start_.setHours( start_.getHours() + 7 );
        end_.setHours( end_.getHours() + 7 );

        if(start && end){
            query.andWhere('feedback.createdAt BETWEEN :start_ AND :end_', {start_ , end_});
        }
        const feedbacks =await query.getMany()
        return feedbacks
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