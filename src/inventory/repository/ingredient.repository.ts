import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { Supplier } from "src/supplier/Entity/supplier.entity";
import { EntityRepository, Repository } from "typeorm";
import { ChangeThresholdIngredientDto } from "../Dto/change-threshold-ingredient.dto";
import { CreateIngredientDto } from "../Dto/create-ingredient.dto";
import { GetIngredientsFilterDto } from "../Dto/get-ingredients-filter-dto";
import { IngredientCategory } from "../Entity/ingredient-category.entity";
import { AutoRefillStatus, Ingredient, IngredientUnit } from "../Entity/ingredient.entity";

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient>{

    async GetIngredients(filterDto: GetIngredientsFilterDto, user: User): Promise<Ingredient[]>{
        const {search} = filterDto
        const query = this.createQueryBuilder('ingredient')
        query.where({user})
        if(search){
            query.andWhere(
                'ingredient.name = :search', {search: `%${search}%`}
            )
        }
        const ingredients =await query.getMany()
        return ingredients;
    }

    async GetIngredientById(id: string): Promise<Ingredient>{
        const foundIngredient = this.findOne(id)
        if(!foundIngredient){
            throw new NotFoundException(`Task with id '${id}' not found`)
        }
        return foundIngredient
    }

    async CreateIngredient(createIngredient: CreateIngredientDto, user: User): Promise<string>{
        const {name, stock, priceEach, unit} = createIngredient

        const newIngredient = this.create({name,stock,user,priceEach,unit})
        await this.save(newIngredient)
        return "success"
    }

    async DeleteIngredient(id: string,user:User){
        const deletedIngredint = await this.delete({id,user})
    }

    async ChangeThreshold(id:string, newThreshold: ChangeThresholdIngredientDto ): Promise<Ingredient>{
        const ingredient =await this.GetIngredientById(id)
        const {lowThreshold, highThreshold} = newThreshold
        ingredient.lowThreshold = lowThreshold
        ingredient.highThreshold = highThreshold

        await this.save(ingredient)
        return ingredient
    }

    async ChangeIngredientStock(id:string, amount:number){
        
        const foundIngredient =await this.findOne(id)
        foundIngredient.stock =+foundIngredient.stock + +amount
        if(foundIngredient.stock < amount){
            throw new BadRequestException("Insufficient Ingredient")
        }
        await this.save(foundIngredient)
    }

    async SupplyIngredient(id:string ,amount: number ){
        const foundIngredient =await this.findOne(id)
        foundIngredient.stock += amount
        await this.save(foundIngredient)
    }

    async SetSupplier(id: string, supplier: Supplier, user: User){
       const foundIngredient = await this.findOne(id)
       foundIngredient.supplier = supplier
       await this.save(foundIngredient)
    }

    async SetAutoRefill(id: string , amount :number , threshold : number, user: User) {
        const ingredient  = await this.findOne({user,id})
        if(!ingredient){
            throw new NotFoundException("Not found ingredient")
        }
        ingredient.lowThreshold = threshold
        ingredient.autoRefillAmount = amount
        ingredient.autoRefillStatus = AutoRefillStatus.on
        await this.save(ingredient)
    }

    async ChangeAutorefillStatus(id: string, user: User){
        const ingredient  = await this.findOne({user,id})
        if ( ingredient.autoRefillAmount === null || ingredient.lowThreshold === null){
            throw new BadRequestException("Please set threshold and refill amount")
        }
        ingredient.autoRefillStatus = AutoRefillStatus.on
        await this.save(ingredient)
    }

    async AssignCategory(ingredientId:string, category: IngredientCategory ){
        const ingredient = await this.GetIngredientById(ingredientId)
        ingredient.ingredientCategory =category
        await this.save(ingredient)
    }

    async PatchIngredient(user:User ,id: string, name: string, priceEach:number , lowThreshold: number, unit: IngredientUnit ){
        const ingredient = await this.GetIngredientById(id)
        if(name){
            ingredient.name = name
        }
        if(priceEach){
            ingredient.priceEach = priceEach
        }
        if(lowThreshold){
            ingredient.lowThreshold = lowThreshold
        }
        if(unit){
            ingredient.unit = unit
        }
        console.log(ingredient)
        await this.save(ingredient)

    }

    async PatchIngredientStock(stock : number ,ingredientId: string): Promise<number>{
        const ingredient =await this.GetIngredientById(ingredientId)
        const dif = stock - ingredient.stock
        ingredient.stock = stock
        
        await this.save(ingredient)
        return dif
    }
}