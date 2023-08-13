export class User {
    id: number;
    version: number;

    username: string;
    password: string;
    email: string;
    phoneNo: string;
    address: string;
    status: string

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
