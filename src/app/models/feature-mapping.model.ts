import { Feature } from "./feature.model";
import { Role } from "./role.model";

export class FeatureMapping {
    id: number;
    version: number;

    role = Role;
    feature = Feature
    status: string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
