export type AuthenticateUserInput = {
    email: string,
    password: string
};

export type AuthenticateUserOutput = {
    token: string
};