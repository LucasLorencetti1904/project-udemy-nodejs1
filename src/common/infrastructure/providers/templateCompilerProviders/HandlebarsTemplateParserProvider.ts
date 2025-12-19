import TemplateParserProvider, { TemplateValues, type TemplateParserInput } from "@/common/domain/providers/TemplateParserProvider";
import fs from "fs/promises";
import handlebars from "handlebars";

export default class HandlebarsTemplateParserProvider implements TemplateParserProvider {
    public async parseWithValues(templateInput: TemplateParserInput): Promise<string> {
        try {    
            const template: string = await fs.readFile(templateInput.file, { encoding: "utf-8" });
            if (!this.templateMatch(template, templateInput.values)) {
                throw new Error("Template does not match.");
            }
    
            const handle: HandlebarsTemplateDelegate = handlebars.compile(template);
            return handle(templateInput.values);
        }

        catch(e: unknown) {
            throw e;
        }
    }

    private templateMatch(template: string, values: TemplateValues): boolean {
        const valuesToCheck: string[] = Object.keys(values);

        return valuesToCheck.every((value) => template.includes(`{{${value}}}`));
    }
}