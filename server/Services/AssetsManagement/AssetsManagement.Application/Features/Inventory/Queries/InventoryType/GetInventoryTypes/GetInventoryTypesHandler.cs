using Microsoft.EntityFrameworkCore;

public class GetInventoryTypesHandler(IApplicationDbContext context) : IQueryHandler<GetInventoryTypesQuery, Result<GetInventoryTypesResult>>
{
  public async Task<Result<GetInventoryTypesResult>> Handle(GetInventoryTypesQuery query, CancellationToken cancellationToken)
  {
    var inventoryTypes = await context.InventoryTypes.ToListAsync();
    if (!inventoryTypes.Any())
    {
      return Result<GetInventoryTypesResult>.Failure("No InventoryTypes found");
    }
    var result = inventoryTypes.ToInventoryTypeList();
    return Result<GetInventoryTypesResult>.Success(new GetInventoryTypesResult(result));
  }
}