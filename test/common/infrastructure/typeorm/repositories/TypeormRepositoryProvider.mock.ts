import type RepositorySearcher from "@/common/domain/search/repositorySearcher/RepositorySearcher";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterProvider";

export class MockSearchQueryFormatter<TModel> implements SearchQueryFormatter<TModel> {
    public formatInput = vi.fn();
}

export class MockRepositorySearcher<TModel> implements RepositorySearcher<TModel> {
    public search = vi.fn()
}