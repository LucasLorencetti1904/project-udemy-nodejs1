export type EmailInput = {
    to: string,
    subject: string,
    body: string
};

export default interface EmailProvider {
    sendEmail(emailInput: EmailInput): Promise<void>;
}