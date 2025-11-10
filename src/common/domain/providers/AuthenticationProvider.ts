export type TokenGenerationOutput = {
    token: string
};

export type VerificationTokenOutput = {
    userId: string
};

export default interface AuthenticationProvider {
    generateToken(userId: string): TokenGenerationOutput;
    verifyToken(token: string): VerificationTokenOutput;
}