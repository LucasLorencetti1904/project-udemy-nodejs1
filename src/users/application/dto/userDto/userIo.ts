export type UserInput = {
    name?: string,
    email?: string,
    password?: string
};

export type UserOutput = {
    id: string,
    name: string,
    email: string,
    avatar?: string,
    createdAt: Date,
    updatedAt: Date
};