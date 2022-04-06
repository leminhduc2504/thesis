import { Feedback } from "../Entity/feedback.entity";

export class ReponseFeedbackDto{
    amount: number
    overall: FeedbackOverall
    feedbacks : Feedback[]
}

export class  FeedbackOverall {
    overall: number = 0

    staff: number  = 0

    cleanliness: number = 0

    facilities: number = 0

    valueForMoney: number = 0

    appetite : number = 0

    serviceTime : number= 0
}