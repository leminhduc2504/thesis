import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateFeedbackDto } from './Dto/create-feedback-dto';
import { FeedbackFilterDto } from './Dto/get-filter-dto';
import { Feedback } from './Entity/feedback.entity';
import { FeedbackRepository } from './Repository/feedback.repository';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectRepository(FeedbackRepository)
        private feedbackRepository: FeedbackRepository,

    ){}

    async CreateFeedback( createFeedbackDto: CreateFeedbackDto,user:User): Promise<Feedback>{
        return this.feedbackRepository.CreateFeedback(createFeedbackDto,user)
    }

    async GetFeedback(filterDto:FeedbackFilterDto, user: User): Promise<Feedback[]>{
        return this.feedbackRepository.GetFeedback(filterDto,user)
    }

}
