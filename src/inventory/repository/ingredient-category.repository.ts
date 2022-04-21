import { BadRequestException, NotFoundException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { IngredientCategory } from "../Entity/ingredient-category.entity";

@EntityRepository(IngredientCategory)
export class IngredientCategoryRepository extends Repository<IngredientCategory>{
    async CreateIngredientCategory(name: string,user: User){
        const dup =await this.count({user,name})
        if(dup>0){
            throw new BadRequestException('Duplicate category name')
        }
        const newCategory = this.create({name,user})
        await this.save(newCategory)
        return "success"
    }

    async GetAllCategory(user:User){
        const query = this.createQueryBuilder('ingredientCategory')
        query.where({user})
        .leftJoinAndSelect("ingredientCategory.ingredients", "ingredients")
        const categories = query.getMany()
        
        return categories
    }

    async GetCategoryById(id: string): Promise<IngredientCategory>{
        
        const foundCategory =await this.findOne(id)
        if(!foundCategory){
            throw new NotFoundException(`Category with id '${id}' not found`)
        }
        return foundCategory
        
    }
}