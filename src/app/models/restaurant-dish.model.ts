import { Dish } from "./dish.model";
import { FoodCategory } from "./food-category.model";
import { Restaurant } from "./restaurant.model";

export class RestaurantDish {
    id: number;
    version: number;

    // foodCategoryId: number;
    // foodCategoryName: string;
    // dishId: number;
    // dishName: string;
    restaurant:Restaurant;
    foodDish:Dish;
    status: string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
