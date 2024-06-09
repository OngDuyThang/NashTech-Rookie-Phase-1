export class PromotionEntity {
    id: string;
    name: string;
    description?: string;
    level: string
    condition: string
    value?: number
    discount_percent: number
    products?: any[];
}