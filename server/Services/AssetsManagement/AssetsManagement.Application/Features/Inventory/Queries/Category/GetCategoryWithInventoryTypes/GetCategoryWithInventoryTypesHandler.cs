using Microsoft.EntityFrameworkCore;

public class GetCategoryWithInventoryTypesHandler(IApplicationDbContext context) : IQueryHandler<GetCategoryWithInventoryTypesQuery, Result<GetCategoryWithInventoryTypesQueryResult>>
{
  public async Task<Result<GetCategoryWithInventoryTypesQueryResult>> Handle(GetCategoryWithInventoryTypesQuery query, CancellationToken cancellationToken)
  {
    var categoryWithInventoryTypes = await
     context.InventoryCategories
     .Where(x => x.Id == InventoryCategoryId.Of(query.Id))
     .Select(x => new GetCategoryWithInventoryTypesQueryResult(
      CategoryId: x.Id.Value,
      InventoryTypes: context.InventoryTypes
      .Where(i => i.InventoryCategoryId == x.Id)
      .Select(i => new InventoryTypeDto(
        Id: i.Id.Value,
        Code: i.Code.Value,
        Name: i.Name.Value,
        Description: i.Description ?? "",
        InventoryCategoryId: i.InventoryCategoryId.Value
      )).ToList()
     )).FirstOrDefaultAsync();

    if (categoryWithInventoryTypes == null)
    {
      return Result<GetCategoryWithInventoryTypesQueryResult>
                .Failure("Inventory category not found.");
    }
    return Result<GetCategoryWithInventoryTypesQueryResult>
            .Success(categoryWithInventoryTypes);
  }
}