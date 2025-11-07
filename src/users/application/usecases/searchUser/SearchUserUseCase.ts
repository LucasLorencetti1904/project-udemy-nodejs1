import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";

export default interface SearchUserUseCase {
    execute(input: SearchUserInput): Promise<SearchUserOutput>;
}