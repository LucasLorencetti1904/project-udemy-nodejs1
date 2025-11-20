import type Repository from "@/common/domain/repositories/Repository";

export default interface RepositoryProvider<TModel, TCreateModelProps> extends Repository<TModel, TCreateModelProps> {
    findOneBy(field: keyof TModel, value: unknown): Promise<TModel | null>;
    findManyBy(field: keyof TModel, value: unknown): Promise<TModel[]>;
}