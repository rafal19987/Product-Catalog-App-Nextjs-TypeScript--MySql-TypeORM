import {Product} from "@/types/product.types";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    products?: Product[];
}