export type TemplateValues = {
    [key: string]: string
};

export type TemplateParserInput = {
    file: string,
    values: TemplateValues
};

export default interface TemplateParserProvider {
    parseWithValues(templateInput: TemplateParserInput): Promise<string>;
}