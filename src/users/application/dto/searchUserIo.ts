import type { SearchInput, SearchOutput } from "@/common/application/dto/SearchIo";
import { UserInput, UserOutput } from "@/users/application/dto/userIo";


export type SearchUserInput = SearchInput<UserInput>;

export type SearchUserOutput = SearchOutput<UserOutput>;