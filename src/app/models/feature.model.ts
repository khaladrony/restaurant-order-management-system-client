export class Feature {
    id: number;
    version: number;

    featureName: string;
    path: string;
    featureIcon: string;
    type: string;   //link,submenu
    isCollapsed: boolean;
    parentFeature: string;
    status:string;

    createdBy: number;
    updatedBy: number;
    updatedAt: Date;
    createdAt: Date;
}
