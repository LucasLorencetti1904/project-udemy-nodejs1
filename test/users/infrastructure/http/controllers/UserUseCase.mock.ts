import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";

export class MockAuthenticateUserUseCase implements AuthenticateUserUseCase {
    public execute = vi.fn();
}

export class MockCreateUserUseCase implements CreateUserUseCase {
    public execute = vi.fn();
}

export class MockSearchUserUseCase implements SearchUserUseCase {
    public execute = vi.fn();
}