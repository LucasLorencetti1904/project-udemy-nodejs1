import type { ProductOutput } from "@/products/application/dto/productIo";

export type SearchProductInput = {
    pagination?: {
        pageNumber?: number,
        itemsPerPage?: number
    },
    sorting?: {
        field?: string,
        direction?: string
    },
    filter?: {
        field?: string,
        value?: string
    }
};

export type SearchProductOutput = {
    items: ProductOutput[],
    total: number,
    pagination: {
        currentPage: number,
        itemsPerPage: number,
        lastPage: number
    }
};