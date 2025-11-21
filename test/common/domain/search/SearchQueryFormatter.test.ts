import RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";
import RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterProvider";
import SearchQueryFormatterConfig from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterConfig";
import SearchQueryFormatterImpl from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterProviderImpl";
import type TestModel from "test/testingTools/testingTypes/TestModel";

const formatterConfig: SearchQueryFormatterConfig<TestModel> = {
    sortableFields: new Set(["modelString", "createdAt"]),
    filterableFields: new Set(["modelString"]),
    defaultProperties: {
        pagination: {
            pageNumber: 1,
            itemsPerPage: 15
        },
        sorting: {
            field: "createdAt",
            direction: "desc"
        },
        filter: {
            field: "modelString",
            value: ""
        }
    }
};

const toTestFormatters: SearchQueryFormatter<TestModel>[] = [
    new SearchQueryFormatterImpl(formatterConfig)
];

toTestFormatters.forEach((sut) => {
    let input: RepositorySearchinput;
    let result: RepositorySearchDSL<TestModel>;

    describe(`${sut.constructor.name} Test`, () => {
        it ("should apply default options when input is undefined.", () => {
            result = sut.formatInput({});

            expect (result).toEqual(formatterConfig.defaultProperties);
        });

        [
            { occurrence: "negative", values: [-14, 0] },
            { occurrence: "not int", values: [12.6, 1.3] }
        ]
        .forEach(({ occurrence, values }) => {
            it (`should apply default pagination when input pagination values are ${occurrence}.`, () => {
                input = {
                    pagination: {
                        pageNumber: values[0],
                        itemsPerPage: values[1]
                    }
                };
    
                result = sut.formatInput(input);
    
                expect (result.pagination).toEqual(formatterConfig.defaultProperties.pagination);
            });
        });

        it ("should apply default sort field when input sort field is not sortable.", () => {
            input = {
                sorting: {
                    field: "updatedAt"
                }
            };

            result = sut.formatInput(input);

            expect (result.sorting.field).toBe(formatterConfig.defaultProperties.sorting.field);
        });

        it ("should apply default filter field when input filter field is not filterable.", () => {
            input = {
                filter: {
                    field: "createdAt"
                }
            };

            result = sut.formatInput(input);

            expect (result.filter.field).toBe(formatterConfig.defaultProperties.filter.field);
        });   
        
        it ("should apply received options when input is valid.", () => {
            input = {
                pagination: {
                    pageNumber: 4,
                    itemsPerPage: 12
                },
                sorting: {
                    field: "modelString",
                    direction: "asc"
                },
                filter: {
                    field: "modelString",
                    value: "exmpl"
                }
            };

            result = sut.formatInput(input);

            expect (result).toEqual(input);
        });     
    });
});