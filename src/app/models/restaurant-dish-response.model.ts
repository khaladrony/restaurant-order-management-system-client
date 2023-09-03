export class    RestaurantDishResponse {
    id: number;
    version: number;

    foodCategoryId: number;
    category: string;
    categoryImageByte: string;
    categoryImageBlob: string;
    categoryImageName: string;
    categoryImageType: string;
    dishId: number;
    dishName: string;
    dishImageByte: string;
    dishImageBlob: string;
    dishImageName: string;
    dishImageType: string;
    status: string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
