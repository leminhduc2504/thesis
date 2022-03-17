import { isEmpty } from "class-validator";
import { Unit } from "../Entity/ingredientUnit.entity";

export class CreateIngredientDto {
    name: string

    stock: number

}