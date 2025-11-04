export type ProductInput = {
    name?: string,
    price?: number,
    quantity?: number
};

export type ProductOutput = {
    id: string,
    name: string,
    price: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date
};