import CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";

export class MockCreateUserUseCase implements CreateUserUseCase {
    public execute = vi.fn();
}