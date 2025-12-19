import EmailProvider, { EmailInput } from "@/common/domain/providers/SendEmailProvider";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export default class NodemailerEmailProvider implements EmailProvider {
    private readonly transport: Mail = createTransport({ jsonTransport: true });

    public async sendEmail(emailInput: EmailInput): Promise<void> {
        const info = await this.transport.sendMail({
            from: "mailexample@gmail.com",
            to: emailInput.to,
            subject: emailInput.subject,
            text: emailInput.body
        });

        console.log(`Message sent: ${info.messageId}`);
    }
}