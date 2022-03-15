import { isEmpty } from "class-validator";
import { Unit } from "../ingredientUnit.entity";

export class CreateIngredientDto {
    name: string

    stock: number

}