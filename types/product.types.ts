import {Category} from "@/types/category.types";

export interface Product {
    id: string;
    name: string;
    sku: string;
    description: string | null;
    price: number;
    stock: number;
    imageUrl: string | null;
    isActive: boolean;
    categoryId: string | null;
    category: Category | null;
    createdAt: string;
    updatedAt: string;
}