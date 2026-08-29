using Microsoft.EntityFrameworkCore;

public class GetCategoriesHandler(IApplicationDbContext context) : IQueryHandler<GetCategoriesQuery, Result<GetCategoriesResult>>
{
  public async Task<Result<GetCategoriesResult>> Handle(GetCategoriesQuery _, CancellationToken cancellationToken)
  {
    var categories = await context.InventoryCategories.ToListAsync();

    if (!categories.Any())
    {
      return Result<GetCategoriesResult>.Failure("Categories are not added yet");
    }

    return Result<GetCategoriesResult>.Success(new GetCategoriesResult(categories.ToCategoryList()));

  }

}