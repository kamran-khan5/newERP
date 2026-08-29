using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetCategoryHandler(IApplicationDbContext context) : IQueryHandler<GetCategoryQuery, Result<GetCategoryResult>>
{
  public async Task<Result<GetCategoryResult>> Handle(GetCategoryQuery query, CancellationToken cancellationToken)
  {
    var category = await context.InventoryCategories.FirstOrDefaultAsync(c => c.Id == InventoryCategoryId.Of(query.Id), cancellationToken);
    if (category == null)
    {
      throw new CategoryNotFoundException("Category Not Found");
    }

    var result = new CategoryDto(Id: category.Id.Value, Code: category.Code.Value, Name: category.Name.Value, Description: category.Description, IsActive: category.IsActive);

    return Result<GetCategoryResult>.Success(new GetCategoryResult(result));
  }
}