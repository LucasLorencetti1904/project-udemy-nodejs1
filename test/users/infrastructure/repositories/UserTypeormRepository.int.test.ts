import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import User from "@/users/infrastructure/typeorm/entities/User";
import type UserModel from "@/users/domain/models/UserModel";
import type UpdateUserInput from "@/users/application/dto/UpdateUserInput";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import testingDataSource from "@/common/infrastructure/typeorm/config/testingDataSource";
import { randomUUID } from "node:crypto";

describe ("UserTypeormRepository Test.", () => {
    let sut: UserTypeormRepository;
    let exampleOfUser: UserModel;
    let result: UserModel | UserModel[] | RepositorySearchOutput<UserModel>;

    async function createAndSaveUser(userData: User): Promise<UserModel> {
        const toCreate: UserModel = testingDataSource.manager.create(User, userData);
        await testingDataSource.manager.save(toCreate);
        return toCreate;
    }
    
    beforeAll(async () => {
        await testingDataSource.initialize();
    });


    afterAll(async () => {
        await testingDataSource.destroy();
    });

    beforeEach(async () => {
        await testingDataSource.manager.query("DELETE FROM users");
        sut = new UserTypeormRepository(testingDataSource.getRepository(User));
        exampleOfUser = TestingUserFactory.model({});
    });

    describe ("findById", () => {
        it ("should return null when user is not found by id.", async () => {
            result = await sut.findById(randomUUID());
            expect (result).toBeNull();
        });

        it ("should find user by id.", async () => {
            const user: UserModel =  await createAndSaveUser(exampleOfUser);
            result = await sut.findById(user.id);

            expect (result.id).toBe(user.id);
        });
    });

    describe ("findByName", () => {
        it ("should return a empty array when users is not found by name.", async () => {
            result = await sut.findByName("Fake name");
            expect (result).toEqual([]);
        });

        it ("should return array of users found by name.", async () => {
            const user: UserModel = await createAndSaveUser(exampleOfUser);
            result = await sut.findByName(user.name);

            expect (result).toHaveLength(1);
        });
    });

    describe ("create & insert", () => {
        it ("should create a new user object.", () => {
            result = sut.create(exampleOfUser);
            expect (result).toEqual(exampleOfUser);
        });

        it ("should insert a user object.", async () => {
            result = await sut.insert(exampleOfUser);
            expect (result).toEqual(exampleOfUser);
        });
    });

    describe ("update", () => {
        it ("should return the same model when user is not found by id.", async () => {
            result = await sut.update(exampleOfUser);
            expect (result).toEqual(exampleOfUser);
        });

        it ("should update a existent user.", async () => {
            const input: UpdateUserInput = TestingUserFactory.updateInput({ name: "New Name" });
            exampleOfUser = TestingUserFactory.model({ ...input, name: "Old Name" });

            const oldUser: UserModel = await createAndSaveUser(exampleOfUser);
            result = await sut.update({ ...oldUser, ...input });

            expect (result.name).not.toBe(oldUser.name);
        });
    });

    describe ("delete", () => {
        it ("should return null when user is not found by id.", async () => {
            result = await sut.delete(exampleOfUser.id);
            expect (result).toBeNull();
        });

        it ("should delete a existent user and return it.", async () => {
            const existentUser: UserModel = await createAndSaveUser(exampleOfUser);
            result = await sut.delete(existentUser.id);
            const deletedUser: UserModel = await testingDataSource.manager.findOneBy(User, { id: existentUser.id });
            
            expect (!deletedUser && result.name == existentUser.name).toBe(true);
        });
    });

    describe ("search", () => {
        let models: UserModel[];

        async function createAndSaveUsers(UsersData: User[]): Promise<UserModel[]> {
            const toCreate: UserModel[] = testingDataSource.manager.create(User, UsersData);
            await testingDataSource.manager.save(toCreate);
            return toCreate;
        }

        beforeEach(() => {
            models = [
                TestingUserFactory.model({
                    name: "A", email: "examplethree@gmail.com", createdAt: new Date(2025, 4, 19)
                }),
                TestingUserFactory.model({
                    name: "D", email: "examplefour@gmail.com", createdAt: new Date(2019, 2, 17)
                }),
                TestingUserFactory.model({
                    name: "C", email: "exampletwo@gmail.com", createdAt: new Date(2024, 7, 23)
                }),
                TestingUserFactory.model({
                    name: "B", email: "exampleone@gmail.com", createdAt: new Date(2020, 2, 1)
                })
            ]
        });

        afterEach (() => {
            testingDataSource.manager.clear(User);
        });

        it ("should apply a default pagination with the first unsorted items when params is not specified.", async () => {
            models = Array.from({ length: 20 }, () => TestingUserFactory.model({}));
            await createAndSaveUsers(models);
            result = await sut.search({});

            expect (result.items).toHaveLength(15); 
        });
        
        it ("should apply only paginate when other params is null.", async () => {
            models = Array.from({ length: 20 }, () => TestingUserFactory.model({}));
            await createAndSaveUsers(models);
            result = await sut.search({ page: 3, perPage: 7 });

            expect (result.items).toHaveLength(6); 
        });

        it ("should apply only default desc sort by createdAt when params is null.", async () => {
            await createAndSaveUsers(models);
            result = await sut.search({});

            expect (result.items[3].name).toBe("D"); 
        });

        it ("should apply only asc sort by name when other params is null.", async () => {
            await createAndSaveUsers(models);
            result = await sut.search({ sort: "name", sortDir: "asc" });

            expect (result.items[3].name).toBe("D"); 
        });

        it ("should apply only asc sort by email when other params is null.", async () => {
            await createAndSaveUsers(models);
            result = await sut.search({ sort: "email", sortDir: "asc" });

            expect (result.items[3].name).toBe("C"); 
        });
        
        it ("should apply only filter when other params is null.", async () => {
            models = "AB,BC,CA".split(",").map((e) => TestingUserFactory.model({ name: e }));
            await createAndSaveUsers(models);
            result = await sut.search({ filter: "c" });

            expect (result.items[1].name).toBe("CA");
        });

        it ("should apply all params.", async () => {
            models = "TESTE,tst,fake,test,te".split(",").map((e) => {
                return TestingUserFactory.model({ name: e })
            });
            
            await createAndSaveUsers(models);
            result = await sut.search({
                page: 1, perPage: 2, sortDir: "asc", sort: "name", filter: "tes"
            });

            expect (result.items[0].name).toBe("test");
        });
    });
});