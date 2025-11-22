import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/userDto/searchUserIo";

export default interface SearchUserUseCase {
    execute(input: SearchUserInput): Promise<SearchUserOutput>;
}