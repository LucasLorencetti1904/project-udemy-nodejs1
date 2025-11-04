import type UserModel from "@/users/domain/models/UserModel";
import userModelBuilder from "@/users/infrastructure/testing/userModelBuilder";

describe ("UserInMemoryRepository Test.", () => {
    let sut: UserInMemoryRepository;
    let result: UserModel | UserModel[];
    
    beforeEach(() => {
        sut = new UserInMemoryRepository();
    });

    describe ("findByName", () => {
        it ("should return a empty array when user is not found by name.", async () => {
            result = await sut.findByName("Fake Name");
            expect (result).toEqual([]);
        });

        for (let i = 1; i <= 2; i++) {
            it ("should return a array of users when found by name.", async () => {
                const exampleOfUsers: UserModel[] = Array(i)
                    .fill(userModelBuilder({ name: "Valid Name Example" }));
                sut.items.push(exampleOfUsers);
                result = await sut.findByName("Valid Name Example");
                expect (result).toHaveLength(i);
            });
        }
    });

    describe ("findByEmail", () => {
        it ("should return null when user is not found by email.", async () => {
            result = await sut.findByName("Fake Name");
            expect (result).toEqual(null);
        });

        it ("should return user when found by email.", async () => {
            const exampleOfUser: UserModel = userModelBuilder({ email: "testing@gmail.com" });
            sut.items.push(exampleOfUser);
            result = await sut.findByEmail("testing@gmail.com");
            expect (result).toEqual(exampleOfUser);
        });
    });

    describe ("applyFilter", () => {
        beforeEach (() => {
            sut.items = [
                userModelBuilder({ name: "test name" }),
                userModelBuilder({ name: "TEST NAME" }),
                userModelBuilder({ name: "fake name"})
            ];
        });

        type Case = {
            description: string,
            filterInput?: string,
            expected: UserModel[]
        };

        const cases: Case[] = [
            {
                description: "should no filter items when filter param is undefined.",
                filterInput: undefined,
                expected: sut.items
            },
            {
                description: "should filter items using filter param.",
                filterInput: "TES", expected:
                [sut.items[0], sut.items[1]]
            },
            {
                description: "should return a empty array when filter does not matches.",
                filterInput: "truthy name",
                expected: []
            }
        ]

        cases.forEach(({ description, filterInput, expected }) => {
            it (description, async () => {
                const filteredModels: UserModel[] = await sut['applyFilter'] ( 
                    sut.items, filterInput
                );
                expect (filteredModels).toEqual(expected);
            });
        });
    });
});