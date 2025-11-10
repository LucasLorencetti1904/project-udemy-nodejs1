import type UserModel from "@/users/domain/models/UserModel";
import UserInMemoryRepository from "@/users/infrastructure/inMemory/UserInMemoryRepository";
import userModelBuilder from "test/users/testingHelpers/userModelBuilder";

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

                sut.items.push(...exampleOfUsers);
                result = await sut.findByName("Valid Name Example");

                expect (result).toHaveLength(i);
            });
        }
    });

    describe ("findByEmail", () => {
        it ("should return null when user is not found by email.", async () => {
            result = await sut.findByEmail("Fake Name");
            expect (result).toEqual(null);
        });

        it ("should return user when found by email.", async () => {
            const exampleOfUser: UserModel = userModelBuilder({ email: "testing@gmail.com" });
            sut.items.push(exampleOfUser);
            result = await sut.findByEmail("testing@gmail.com");

            expect (result).toEqual(exampleOfUser);
        });
    });

    
    describe ("applySort", () => {
        beforeEach (() => {    
            sut.items = [
                userModelBuilder({
                    name: "b", email: "userone@gmail.com", createdAt: new Date(2024, 8, 12)
                }),
                userModelBuilder({
                    name: "a", email: "usertwo@gmail.com", createdAt: new Date(2025, 10, 19)
                }),
                userModelBuilder({
                    name: "c", email: "userthree@gmail.com", createdAt: new Date(2025, 2, 29)
                })
            ];
        });

        let sortedModels: UserModel[];

        type SortCase = {
            description: string,
            sortInput?: keyof UserModel,
            sortDirInput?: "asc" | "desc", 
            expected: () => UserModel[]
        };

        const sortCases: SortCase[] = [
            {
                description: "should sort items by createdAt using desc order when sort and sortDir params is undefined.",
                sortInput: undefined,
                sortDirInput: undefined,
                expected: () => [sut.items[1], sut.items[2], sut.items[0]]
            },
            {
                description: "should no sort items when sort param is not sortable field.",
                sortInput: "id",
                sortDirInput: "asc",
                expected: () => sut.items
            },
            {
                description: "should sort items by createdAt using asc order.",
                sortInput: undefined,
                sortDirInput: "asc",
                expected: () => [sut.items[0], sut.items[2], sut.items[1]]
            },
            {
                description: "should sort items by name using desc order.",
                sortInput: "name",
                sortDirInput: "desc",
                expected: () => [sut.items[2], sut.items[0], sut.items[1]]
            },
            {
                description: "should sort items by email using asc order.",
                sortInput: "email",
                sortDirInput: "asc",
                expected: () => [sut.items[0], sut.items[2], sut.items[1]]
            }
        ];

        sortCases.forEach(({ description, sortInput, sortDirInput, expected }) => {
            it (description, async () => {
                sortedModels = await sut['applySort'](sut.items, sortInput, sortDirInput);
                expect (sortedModels).toEqual(expected());
            });
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
        
        type FilterCase = {
            description: string,
            filterInput?: string,
            expected: () => UserModel[]
        };

        const filterCases: FilterCase[] = [
            {
                description: "should no filter items when filter param is undefined.",
                filterInput: undefined,
                expected: () => sut.items
            },
            {
                description: "should filter items using filter param.",
                filterInput: "TES",
                expected: () => [sut.items[0], sut.items[1]]
            },
            {
                description: "should return a empty array when filter does not matches.",
                filterInput: "truthy name",
                expected: () => []
            }
        ]

        filterCases.forEach(({ description, filterInput, expected }) => {
            it (description, async () => {
                const filteredModels: UserModel[] = await sut['applyFilter'] ( 
                    sut.items, filterInput
                );
                
                expect (filteredModels).toEqual(expected());
            });
        });
    });
});