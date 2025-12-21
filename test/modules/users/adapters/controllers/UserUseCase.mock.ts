import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import RequestUserPasswordResetUseCase from "@/users/application/usecases/requestUserPasswordReset/RequestUserPasswordResetUseCase";
import ResetUserPasswordUseCase from "@/users/application/usecases/resetUserPassword/ResetUserPasswordUseCase";
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

export class MockRequestUserPasswordResetUseCase implements RequestUserPasswordResetUseCase {
    public execute = vi.fn();
}

export class MockResetUserPasswordUseCase implements ResetUserPasswordUseCase {
    public execute = vi.fn();
}