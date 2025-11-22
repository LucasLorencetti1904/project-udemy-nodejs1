import { inject, injectable } from "tsyringe";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type CreateUserInput from "@/users/application/dto/userDto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userDto/userIo";
import { BadRequestError, ConflictError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class CreateProductUseCaseImpl extends UserUseCase implements CreateUserUseCase {
    constructor(
        @inject("UserRepository")
        private readonly repo: UserRepository,
        
        @inject("StringHashProvider")
        protected readonly hashProvider: StringHashProvider
    ) { super(); }

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

            const user: UserModel = await this.repo.create({ ...input, password: hashPassword });

            return this.mapToUserOutput(user);
        }
        catch (e: unknown) {
            ApplicationHandler.handleErrors(e);
        }
    }
    
    private someInvalidField(input: CreateUserInput): boolean {
        return !input.name || !input.email || !input.password;
    }
}