using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetInventoryTypeHandler(IApplicationDbContext context) : IQueryHandler<GetInventoryTypeQuery, Result<GetInventoryTypeResult>>
{
  public async Task<Result<GetInventoryTypeResult>> Handle(GetInventoryTypeQuery query, CancellationToken cancellationToken)
  {
    var inventory = await context.InventoryTypes.FirstOrDefaultAsync(x => x.Id == InventoryTypeId.Of(query.Id), cancellationToken);
    if (inventory == null)
    {
      throw new InventoryNotFoundException("Inventory Type NotFound");
    }
    return Result<GetInventoryTypeResult>.Success(new GetInventoryTypeResult(new InventoryTypeDto(
      Id: inventory.Id.Value,
      Code: inventory.Code.Value,
      Name: inventory.Name.Value,
      Description: inventory.Description ?? "",
      InventoryCategoryId: inventory.InventoryCategoryId.Value
    )));
    throw new NotImplementedException();
  }
}











