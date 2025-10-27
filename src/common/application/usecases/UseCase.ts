export default abstract class UseCase {
    protected readonly repo: unknown;
    public abstract execute(input: unknown): Promise<unknown>;
}