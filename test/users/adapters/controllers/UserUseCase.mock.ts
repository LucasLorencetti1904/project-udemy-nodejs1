import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import ResetUserPasswordWithEmailUseCase from "@/users/application/usecases/resetUserPasswordWithEmail/ResetUserPasswordWithEmailUseCase";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import type UpdateUserAvatarUseCase from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCase";

export class MockAuthenticateUserUseCase implements AuthenticateUserUseCase {
    public execute = vi.fn();
}

export class MockCreateUserUseCase implements CreateUserUseCase {
    public execute = vi.fn();
}

export class MockSearchUserUseCase implements SearchUserUseCase {
    public execute = vi.fn();
}

export class MockUpdateUserAvatarUseCase implements UpdateUserAvatarUseCase {
    public execute = vi.fn();
}

export class MockResetUserPasswordWithEmailUseCase implements ResetUserPasswordWithEmailUseCase {
    public execute = vi.fn();
}