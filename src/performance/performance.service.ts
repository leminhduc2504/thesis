import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';
import { DishService } from 'src/dish/dish.service';
import { FilterGetOrderDto } from 'src/order/Dto/filter-get-order.dto';
import { OrderService } from 'src/order/order.service';
import { CreateFeedbackDto } from './Dto/create-feedback-dto';
import { DateFilterDto } from './Dto/get-filter-dto';
import { ReponseFeedbackDto } from './Dto/reponse-feedback-dto';
import { Feedback } from './Entity/feedback.entity';
import { FeedbackRepository } from './Repository/feedback.repository';
import { DishAnalysis, IngredientAnalysis, OrderAnalysis } from './Repository/order-analysis-.dto';

@Injectable()
export class PerformanceService {
    GetOrderPerformance(dateFilterDto: DateFilterDto, user: User) {
        throw new Error('Method not implemented.');
    }
    constructor(
        @InjectRepository(FeedbackRepository)
        private feedbackRepository: FeedbackRepository,

        private orderService: OrderService,
        private dishService: DishService,
        private authService: AuthService

        

    ){}

    async CreateFeedback( createFeedbackDto: CreateFeedbackDto): Promise<Feedback>{
        const {userId}= createFeedbackDto
        const user =await this.authService.GetUserById(userId)
        return this.feedbackRepository.CreateFeedback(createFeedbackDto,user)
    }

    async GetFeedback(filterDto:DateFilterDto, user: User): Promise<ReponseFeedbackDto>{
        return this.feedbackRepository.GetFeedback(filterDto,user)
    }

    async GetFeedbackList(filterDto:DateFilterDto, user: User): Promise<Feedback[]>{
        return this.feedbackRepository.GetFeedbackList(filterDto,user)
    }

    async GetOrderPerformanceDaily(date: DateFilterDto,user: User): Promise<OrderAnalysis>{
        const status = null 
        const {start} =date 
        const startC = new Date(start)
        const endDate = new Date(startC.getTime() + (1000 * 60 * 60 * 24));

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: endDate }
        const orders =await this.orderService.GetOrders(getOrderDto,user)
        
        const analysis : OrderAnalysis = new OrderAnalysis()
        analysis.dishs = new Array<DishAnalysis>()
        analysis.orderAmount = orders.length
        analysis.ingredients = new Array<IngredientAnalysis>()
        orders.forEach( (order) =>  {
            analysis.retailPrice =+ analysis.retailPrice + +order.orderPrice
            order.orderDishs.forEach(  (orderDish)=> {
                const found = analysis.dishs.find( e => e.dish.id === orderDish.dish.id );
                if (found){
                    found.dishAmount += orderDish.amount
                }
                else{
                    const newDishs = new DishAnalysis()
                    newDishs.dish = orderDish.dish
                    newDishs.dishAmount = orderDish.amount
                    analysis.dishs.push(newDishs)
                }
            })
        }) 
        for (let i = 0; i <analysis.dishs.length; i++ ){
            const dishIngredients = await this.dishService.GetDishIngredients(analysis.dishs[i].dish.id);
            dishIngredients.forEach((dishIngredient) => {
                const found = analysis.ingredients.find(e => e.ingredient.id === dishIngredient.ingredient.id);
                if (found) {
                    found.ingredientAmount =+found.ingredientAmount + +dishIngredient.amount*+analysis.dishs[i].dishAmount;
                }
                else {
                    const newIngredients = new IngredientAnalysis()
                    newIngredients.ingredient = dishIngredient.ingredient;
                    newIngredients.ingredientAmount = +dishIngredient.amount*+analysis.dishs[i].dishAmount;
                    analysis.ingredients.push(newIngredients);
                }
            });
        }
    
        return  analysis
    }
    

    // async GetOrderPerformanceWeekly(date:Date, user: User): Promise<OrderAnalysis[]>{
    //     for(let i = 0 ; i)
    // }

    // async GetOrderPerformanceMonthly(date:Date, user:User): Promise<OrderAnalysis[]>{

    // }

}
