import { NotFoundException } from "@nestjs/common";
import { identity, NotFoundError } from "rxjs";
import { EntityRepository, Repository } from "typeorm";
import { ChangeThresholdIngredientDto } from "./Dto/change-threshold-ingredient.dto";
import { CreateIngredientDto } from "./Dto/create-ingredient.dto";
import { Ingredient } from "./ingredient.entity";

@EntityRepository(Ingredient)
export class IngredientRepository extends Repository<Ingredient>{
    async GetTaskById(id: string): Promise<Ingredient>{
        const foundIngredient = this.findOne(id)
        if(!foundIngredient){
            throw new NotFoundException(`Task with id '${id}' not found`)
        }
        return foundIngredient
    }

    async CreateIngredient(createIngredient: CreateIngredientDto): Promise<string>{
        const {name, stock} = createIngredient

        const newIngredient = this.create({name,stock})
        await this.save(newIngredient)
        return "success"
    }

    async DeleteIngredient(id: string): Promise<void>{
        const deletedIngredint = await this.delete(id)
        console.log(deletedIngredint)
    }

    async ChangeThreshold(id:string, newThreshold: ChangeThresholdIngredientDto ): Promise<Ingredient>{
        const ingredient =await this.GetTaskById(id)
        const {lowThreshold, highThreshold} = newThreshold
        ingredient.lowThreshold = lowThreshold
        ingredient.highThreshold = highThreshold

        await this.save(ingredient)
        return ingredient
    }

   
}