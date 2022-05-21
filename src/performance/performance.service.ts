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
import { OrderDish } from 'src/order/Entity/order-dish.entity';
import { DishCookingPerformance } from './Dto/cooking-performance-response.dto';

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

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: startC }
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
    

    async GetDishIngredientByHours(date: DateFilterDto,user: User){
        const status = null 
        const {start,end} =date 
        const startC = new Date(start)
        const endDate = new Date(end);

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: endDate }

        const orders =await this.orderService.GetOrders(getOrderDto,user)
        const responesIngredient = new IngredientGraph()
        responesIngredient.labels = new Array<string>()
        responesIngredient.dataset = new Array<DatasetIngredient>()

        const ingredients =await this.ingedientService.GetAllIngredient(user)

        ingredients.forEach(ingredient => {
            const data = new DatasetIngredient()
            data.label = ingredient.name
            data.borderWidth = 1
            data.data = new Array<number>()
            responesIngredient.dataset.push(data)
        })

        const responseDish = new IngredientGraph()
        responseDish.labels = new Array<string>()
        responseDish.dataset = new Array<DatasetIngredient>()

        const dishs =await this.dishService.GetAllDishs(user)

        dishs.forEach(dish => {
            const data = new DatasetIngredient()
            data.label = dish.name
            data.borderWidth = 1
            data.data = new Array<number>()
            responseDish.dataset.push(data)
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
                const result = responesIngredient.dataset.find(e => e.label === ingredient.ingredient.name)
                result.data.push(ingredient.ingredientAmount)
            })
            
            responesIngredient.labels.push(i.toString())
            responesIngredient.dataset.forEach(e => {
                if(e.data.length < responesIngredient.labels.length){
                    e.data.push(0)
                }
            })

            analysis.dishs.forEach(dish => {
                const result = responseDish.dataset.find(e => e.label === dish.dish.name)
                result.data.push(dish.dishAmount)
            })
            
            responseDish.labels.push(i.toString())
            responseDish.dataset.forEach(e => {
                if(e.data.length < responseDish.labels.length){
                    e.data.push(0)
                }
            })

        }
        
       return {ingredient :responesIngredient,dish :responseDish}
    }

    async GetOrderByHours(date: DateFilterDto,user: User){
        const status = null 
        const {start,end} =date 
        const startC = new Date(start)
        const endDate = new Date(end);

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: endDate }

        const orders =await this.orderService.GetOrders(getOrderDto,user)

        const amount = new Array<number>()
        const profit = new Array<number>()
        for(let i = 8; i <= 21 ; i++){
            let profitCount = 0
            var orderFilter = orders.filter(function (e) {
                return e.createdAt.getHours() >= i &&
                       e.createdAt.getHours() < i+1
            });
            amount.push(orderFilter.length)
            for(let i = 0 ; i <orderFilter.length; i++ ){
                profitCount= +orderFilter[i].orderPrice +  +profitCount
            }
            profit.push(profitCount)
        }
        return {amount,profit}
    }

    async GetDishCookingPerformanceByDay(date:DateFilterDto, user:User){
        const status = null 
        const {start,end} =date 
        const startC = new Date(start)

        const getOrderDto: FilterGetOrderDto = {status,start:startC,end: startC }
       
        const orders =await this.orderService.GetOrders(getOrderDto,user)
        let foundOrderDish = Array<OrderDish>()
        for(let i = 0 ; i < orders.length; i++){
            foundOrderDish = foundOrderDish.concat(await this.orderService.GetOrderDishsByOrderId(orders[i].orderId))
        }

        let response = Array<DishCookingPerformance>()
        console.log(foundOrderDish)
        for(let i = 0 ; i < foundOrderDish.length; i++){
            let foundResponse = response.find(e => e.dish == foundOrderDish[i].dish)
            console.log()
            console.log(i)
            console.log(foundResponse)
            if(foundResponse){

                foundResponse.amount = +foundResponse.amount +1
                foundResponse.orderDish.push(foundOrderDish[i])
                foundResponse.secondCookingTimeTotal =+foundResponse.secondCookingTimeTotal + +this.TimeStringToSecond(foundOrderDish[i].cookingTime)
                foundResponse.cookingTimeAvr =this.SecondToTimeString(foundResponse.secondCookingTimeTotal/ foundResponse.amount)
            }
            else {
                let dishCookingPerformance = new DishCookingPerformance()
                dishCookingPerformance.amount = 1
                dishCookingPerformance.dish = foundOrderDish[i].dish
                dishCookingPerformance.secondCookingTimeTotal = +this.TimeStringToSecond(foundOrderDish[i].cookingTime)
                dishCookingPerformance.orderDish = new Array<OrderDish>()
                dishCookingPerformance.orderDish.push(foundOrderDish[i])
                dishCookingPerformance.cookingTimeAvr =this.SecondToTimeString(dishCookingPerformance.secondCookingTimeTotal)
                let foundDish =await this.dishService.GetDishById(foundOrderDish[i].dish.id)
                dishCookingPerformance.cookingTimeEst = foundDish.estimatedCookingTime
                response.push(dishCookingPerformance)
            }
            
        }
        return response
    }

    TimeStringToSecond(timeString : string): number{
        const [hours, minutes, seconds] = timeString.split(':');
        const totalSeconds = (+hours) * 60 * 60 + (+minutes) * 60 + (+seconds);
        return totalSeconds
    }

    SecondToTimeString(e){
        var h = Math.floor(e / 3600).toString().padStart(2,'0'),
            m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
            s = Math.floor(e % 60).toString().padStart(2,'0');
        return h + ':' + m + ':' + s;
    }


    async GetIngredientChangeByUserByDay(date:DateFilterDto, user:User){
        const {start,end} =date 
        const startC = new Date(start)
        const endDate = new Date(end);

        const response = this.ingedientService.GetStockChangeHistoryByUserByDay({start:startC,end:endDate},user)
        return response
    }

    async GetTop5DishIngredient7Dyas(filter: DateFilterDto,user:User){
        
        
    }
}


