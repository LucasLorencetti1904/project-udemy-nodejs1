export type UserInput = {
    name?: string,
    email?: string,
    password?: string
};

export type UserOutput = Required<UserInput> & {
    id: string,
    avatar?: string
    createdAt: Date,
    updatedAt: Date
};