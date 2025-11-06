import { inject, injectable } from "tsyringe";
import { BadRequestError } from "@/common/domain/errors/httpErrors";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import UserRepository from "@/users/domain/repository/UserRepository";
import { UserOutput } from "@/users/application/dto/userIo";
import CreateUserInput from "@/users/application/dto/CreateUserInput";
import UserModel from "@/users/domain/models/UserModel";

@injectable()
export default class CreateProductUseCaseImpl extends UserUseCase implements CreateUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        
        @inject("StringHashProvider")
        protected readonly hashProvider: StringHashProvider
    ) { super(repo) }

    public async execute(input: CreateUserInput): Promise<UserOutput> {
        if (this.someInvalidField(input)) {
            throw new BadRequestError("Input data not provided or invalid.");
        }

        try {
            await this.checkIfEmailAlreadyExists(input.email);

            const hashPassword: string = await this.hashProvider.hashString(input.password);

            const user: UserModel = this.repo.create({ ...input, password: hashPassword });
            await this.repo.insert(user);

            return user;
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    protected someInvalidField(input: CreateUserInput): boolean {
        return !input.name || !input.email || !input.password;
    }
}