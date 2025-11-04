import type { SearchInput, SearchOutput } from "@/common/application/dto/SearchIo";
import type UserModel from "@/users/domain/models/UserModel"


export type SearchUserInput = SearchInput<UserModel>;

export type SearchUserOutput = SearchOutput<UserModel>;