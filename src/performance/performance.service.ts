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
import { DishAnalysis, IngredientAnalysis, OrderAnalysis } from './Dto/order-analysis-.dto';
import { DatasetIngredient, IngredientGraph, ReponseFilterOrderByDay, ResponseDishAnalysByDay, ResponseIngredientAnalysByDay } from './Dto/reponse-order-filter-day.dto';
import { InventoryService } from 'src/inventory/inventory.service';
import e, { response } from 'express';

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
        private authService: AuthService,
        private ingedientService: InventoryService
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
            analysis.ingredientPrice =+ analysis.ingredientPrice + +order.ingredientPrice
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
    
    async GetOrderAmountByDay(date: DateFilterDto,user: User){
        const status = null 
        let {start,end} =date 
        const startC = new Date(start)
        const endC = new Date(end)
        const response = new ReponseFilterOrderByDay()
        response.amount = new Array<number>()
        response.dates = new Array<string>()
        response.profit = new Array<number>()
        
        for (let date_ =startC ; date_ <= endC; date_.setHours(date_.getHours() + 24)) {
        
            const orders = await this.orderService.GetOrders({status:null,start:date_,end:date_ },user)
            let _profit = 0.00

            orders.forEach(order => {
                _profit =+_profit + (+order.orderPrice - +order.ingredientPrice)
            })

            response.profit.push(_profit)
            response.amount.push(orders.length)
            response.dates.push(date_.toLocaleDateString("he-il"))
        }
        return response
    }
    

    async GetIngredientAnalysByDay(date: DateFilterDto,user: User) {
        const status = null 
        let {start,end} =date 
        const startC = new Date(start)
        const endC = new Date(end)
        const response = new ResponseIngredientAnalysByDay()
        response.dates = new Array<string>()
        response.ingredientAnalys = new Array<Array<IngredientAnalysis>>()
        for (let date_ =startC ; date_ <= endC; date_.setHours(date_.getHours() + 24)) {
            const raw = await this.GetOrderPerformanceDaily({start:date_,end}, user)
            response.ingredientAnalys.push(raw.ingredients)
            response.dates.push(date_.toLocaleDateString("he-il"))
        }
        return response
    }

    async GetDishAnalysByDay(date: DateFilterDto,user: User) {
        const status = null 
        let {start,end} =date 
        const startC = new Date(start)
        const endC = new Date(end)
        const response = new ResponseDishAnalysByDay()
        response.dates = new Array<string>()
        response.dishAnalys = new Array<Array<DishAnalysis>>()
        for (let date_ =startC ; date_ <= endC; date_.setHours(date_.getHours() + 24)) {
            const raw = await this.GetOrderPerformanceDaily({start:date_,end}, user)
            response.dishAnalys.push(raw.dishs)
            response.dates.push(date_.toLocaleDateString("he-il"))
        }
        return response
    }

    async GetIngredientAnalysByDay2(date: DateFilterDto,user: User) {
        let {start,end} =date 
        const startC = new Date(start)
        const endC = new Date(end)
        const response = new IngredientGraph()
        response.labels = new Array<string>()
        response.dataset = new Array<DatasetIngredient>()

        const ingredients =await this.ingedientService.GetAllIngredient(user)

        ingredients.forEach(ingredient => {
            const data = new DatasetIngredient()
            data.label = ingredient.name
            data.borderWidth = 1
            data.data = new Array<number>()
            response.dataset.push(data)
        })

        for (let date_ =startC ; date_ <= endC; date_.setHours(date_.getHours() + 24)) {

            const raw = await this.GetOrderPerformanceDaily({start:date_,end}, user)
            raw.ingredients.forEach(ingredient => {
                const result = response.dataset.find(e => e.label === ingredient.ingredient.name)
                result.data.push(ingredient.ingredientAmount)
            })
            
            response.labels.push(date_.toLocaleDateString("he-il"))
            response.dataset.forEach(e => {
                if(e.data.length < response.labels.length){
                    e.data.push(0)
                }
            })
        }
        return response
    }

    async GetDishAnalysByDay2(date: DateFilterDto,user: User) {
        let {start,end} =date 
        const startC = new Date(start)
        const endC = new Date(end)
        const response = new IngredientGraph()
        response.labels = new Array<string>()
        response.dataset = new Array<DatasetIngredient>()

        const dishs =await this.dishService.GetAllDishs(user)

        dishs.forEach(dish => {
            const data = new DatasetIngredient()
            data.label = dish.name
            data.borderWidth = 1
            data.data = new Array<number>()
            response.dataset.push(data)
        })

        for (let date_ =startC ; date_ <= endC; date_.setHours(date_.getHours() + 24)) {

            const raw = await this.GetOrderPerformanceDaily({start:date_,end}, user)
            raw.dishs.forEach(dish => {
                const result = response.dataset.find(e => e.label === dish.dish.name)
                result.data.push(dish.dishAmount)
            })
            
            response.labels.push(date_.toLocaleDateString("he-il"))
            response.dataset.forEach(e => {
                if(e.data.length < response.labels.length){
                    e.data.push(0)
                }
            })
        }
        return response
    }
    

    async GetOrderPerformanceDailyByHours(date: DateFilterDto,user: User){
        const status = null 
        const {start,end} =date 
        const startC = new Date(start)
        const endDate = new Date(end);

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: endDate }

        const orders =await this.orderService.GetOrders(getOrderDto,user)
        const response1 = new IngredientGraph()
        response1.labels = new Array<string>()
        response1.dataset = new Array<DatasetIngredient>()

        const ingredients =await this.ingedientService.GetAllIngredient(user)

        ingredients.forEach(ingredient => {
            const data = new DatasetIngredient()
            data.label = ingredient.name
            data.borderWidth = 1
            data.data = new Array<number>()
            response1.dataset.push(data)
        })


        for(let i = 8; i <= 21 ; i++){
            var orderFilter = orders.filter(function (e) {
                return e.createdAt.getHours() >= i &&
                       e.createdAt.getHours() < i+1
            });

            const analysis : OrderAnalysis = new OrderAnalysis()
            analysis.dishs = new Array<DishAnalysis>()
            analysis.ingredients = new Array<IngredientAnalysis>()
            orderFilter.forEach( (order) =>  {
                analysis.retailPrice =+ analysis.retailPrice + +order.orderPrice
                analysis.ingredientPrice =+ analysis.ingredientPrice + +order.ingredientPrice
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
            analysis.ingredients.forEach(ingredient => {
                const result = response1.dataset.find(e => e.label === ingredient.ingredient.name)
                result.data.push(ingredient.ingredientAmount)
            })
            
            response1.labels.push(i.toString())
            response1.dataset.forEach(e => {
                if(e.data.length < response1.labels.length){
                    e.data.push(0)
                }
            })

        }
        
       return {response1}
        
    }
}
