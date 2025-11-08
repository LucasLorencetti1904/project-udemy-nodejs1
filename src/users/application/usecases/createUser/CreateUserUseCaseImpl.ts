import { inject, injectable } from "tsyringe";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import type UserRepository from "@/users/domain/repositories/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type CreateUserInput from "@/users/application/dto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class CreateProductUseCaseImpl extends UserUseCase implements CreateUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        
        @inject("StringHashProvider")
        protected readonly hashProvider: StringHashProvider
    ) { super(repo); }

    public async execute(input: CreateUserInput): Promise<UserOutput> {
       
        try {
            if (this.someInvalidField(input)) {
                throw new BadRequestError("Input data not provided or invalid.");
            }

            const emailExists: boolean = !!( await this.repo.findByEmail(input.email));

            if (emailExists) {
                throw new ConflictError(`User already registered with email ${input.email}.`);
            }

            const hashPassword: string = await this.hashProvider.hashString(input.password);

            const user: UserModel = this.repo.create({ ...input, password: hashPassword });
            await this.repo.insert(user);

            return this.mapToUserOutput(user);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }
    
    private someInvalidField(input: CreateUserInput): boolean {
        return !input.name || !input.email || !input.password;
    }
}