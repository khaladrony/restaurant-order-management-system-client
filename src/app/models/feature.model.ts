export class Feature {
    id: number;
    version: number;

    name: string;
    path: string;
    icon: string;
    type: string;   //link,submenu
    isCollapsed: boolean;
    parentFeatureId: number;
    parentFeatureName: string;
    status:string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
