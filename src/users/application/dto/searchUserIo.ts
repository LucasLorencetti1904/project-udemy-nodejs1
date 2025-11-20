import type { UserOutput } from "@/users/application/dto/userIo";


export type SearchUserInput = {
    pagination?: {
        pageNumber?: number,
        itemsPerPage?: number
    },
    sorting?: {
        field?: string,
        direction?: string
    },
    filter?: {
        field?: string,
        value?: string
    }
};

export type SearchUserOutput = {
    items: UserOutput[],
    total: number,
    pagination: {
        currentPage: number,
        itemsPerPage: number,
        lastPage: number
    }
};