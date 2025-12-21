import type TemplateParserProvider from "@/common/domain/providers/TemplateParserProvider";
import HandlebarsTemplateParserProvider from "@/common/infrastructure/providers/templateParserProviders/HandlebarsTemplateParserProvider";
import path from "path";
import fs from "fs/promises";

const templateFilePath: string = path.resolve(
    process.cwd(),
    "./test/testingFiles"
);

let templateFile: string;

const toTest: TemplateParserProvider[] = [
    new HandlebarsTemplateParserProvider()
];

beforeEach (async () => {
    templateFile = path.resolve(templateFilePath, "template.hbs");
    await fs.rm(templateFile, { force: true });
});

toTest.forEach((sut) => {
    describe (`${sut.constructor.name} Test.`, () => {
        it ("should throw error when template file is not found.", async () => {
            templateFile = path.resolve(templateFilePath, "randomFile.hbs");

            await expect(sut.parseWithValues({
                file: templateFile,
                values: {}
            })).rejects.toThrowError();
        });

        it ("should throw error when template file extension is invalid.", async () => {
            templateFile = path.resolve(templateFilePath, "randomFile.invalid");

            await expect(sut.parseWithValues({
                file: templateFile,
                values: {}
            })).rejects.toThrowError();
        });

        it ("should throw error when template file does not match with template values.", async () => {
            await fs.writeFile(templateFile, "Hello, {{name}}!");

            await expect(sut.parseWithValues({
                file: templateFile,
                values: {
                    name: "example",
                    age: "43"
                }
            })).rejects.toThrowError();
        });

        it ("should return parsed template string when template file is valid.", async () => {
            await fs.writeFile(templateFile, "Hello, {{name}} ({{age}} years old)!");

            await expect(sut.parseWithValues({
                file: templateFile,
                values: {
                    name: "example",
                    age: "43"
                }
            })).resolves.toBe("Hello, example (43 years old)!");
        });
    });
});