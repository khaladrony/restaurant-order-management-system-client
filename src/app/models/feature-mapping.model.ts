import { Feature } from "./feature.model";
import { Role } from "./role.model";

export class FeatureMapping {
    id: number;
    version: number;

    roleId: number;
    rolesName: string;
    featureId: number
    featuresName: string;
    status: string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
