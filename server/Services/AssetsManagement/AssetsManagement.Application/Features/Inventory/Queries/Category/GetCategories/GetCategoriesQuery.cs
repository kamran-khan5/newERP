public record GetCategoriesResult(IEnumerable<CategoryDto> Categories);

public record GetCategoriesQuery() : IQuery<Result<GetCategoriesResult>>;