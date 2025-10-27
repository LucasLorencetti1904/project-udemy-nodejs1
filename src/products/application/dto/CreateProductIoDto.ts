export type CreateProductInput = {
    name: string,
    price: number,
    quantity: number
};

export type CreateProductOutput = {
    id: string,
    createdAt: Date,
    updatedAt: Date
} & CreateProductInput;