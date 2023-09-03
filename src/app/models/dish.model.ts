import { FoodCategory } from "./food-category.model";

export class Dish {
    id: number;
    version: number;

    name: string;
    foodCategory: FoodCategory;
    imageName: string;
    imageType: string;
    imageByte: string;
    imageBlob: string;
    status: string

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
