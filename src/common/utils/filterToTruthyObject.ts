export default class DtoUtilities {
    public static filterToTruthyDto<TDto extends object>(dto: TDto): Partial<TDto> {
        return Object.fromEntries (
            Object.entries(dto).filter(([_, v]) => !v)
        ) as Partial<TDto>;
    }   

    public static hasSomeDefinedField<TDto>(dto: TDto): boolean {
        return Object.values(dto).some(v => v != undefined);
    }
}