import { randomUUID } from "node:crypto";
import { StubInMemoryRepository, StubModelProps } from "./stubs";
import { NotFoundError } from "@/common/domain/errors/httpErrors";

describe ("InMemoryRepository Test.", () => {
    let sut: StubInMemoryRepository;
    let model: StubModelProps;
    let props: any;

    beforeEach(() => {
        sut = new StubInMemoryRepository();
        props = {
            name: "test name",
            price: 10.00
        };

        const date: Date = new Date();

        model = {
            id: randomUUID(),
            ...props,
            createdAt: date,
            updatedAt: date
        };
    });

    describe ("'create' Method Test.", () => {
        it ("should create a new model.", () => {
            const result: StubModelProps = sut.create(props);
            expect (result.name).toStrictEqual("test name")
        });
    
        it ("should insert the model.", async () => {
            const result: StubModelProps = await sut.insert(model);
            expect (result).toStrictEqual(sut.items[0])
        });
    })

    describe ("'get' Method Test.", () => {
        it ("should throw an Not Found Error when data is not found by id.", () => {
            expect (sut.findById("some_id")).rejects.toBeInstanceOf(NotFoundError);
        });
    
        it ("should return data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const foundData: StubModelProps = await sut.findById(createdData.id);
            expect(foundData).toEqual(sut.items[0]);
        });
    });

    describe ("'update' Method Test.", () => {
        it ("should throw an Not Found Error when data to be updated is not found by id.", () => {
            expect (sut.update(model)).rejects.toBeInstanceOf(NotFoundError);
        });
    
        it ("should update data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const updatedData: StubModelProps = await sut.update({
                ...createdData,
                name: "new test name",
                price: 12.00
            });
            expect(updatedData).toEqual(sut.items[0]);
        });
    });
    
    describe ("'delete' Method Test.", () => {
        it ("should throw an Not Found Error when data to be deleted is not found by id.", () => {
            expect (sut.delete(model.id)).rejects.toBeInstanceOf(NotFoundError);
        });
    
        it ("should delete data founded by id.", async () => {
            const createdData: StubModelProps = await sut.insert(model);
            const countBeforeDelete: number = sut.items.length;
            await sut.delete(createdData.id);
            const countAfterDelete: number = sut.items.length
            expect([countBeforeDelete, countAfterDelete]).toEqual([1, 0]);
        });
    });
});