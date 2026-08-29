using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetInventoryItemHandler(IApplicationDbContext context) : IQueryHandler<GetInventoryItemQuery, Result<GetInventoryItemQueryResult>>
{
  public async Task<Result<GetInventoryItemQueryResult>> Handle(GetInventoryItemQuery query, CancellationToken cancellationToken)
  {
    var inventoryItem = await context.InventoryItems.FirstOrDefaultAsync(i => i.Id == InventoryItemId.Of(query.Id));
    if (inventoryItem == null)
    {
      throw new InventoryItemNotFoundException("Inventory Item not Found");
    }
    var result = new InventoryItemDto(
    Id: inventoryItem.Id.Value,
    Code: inventoryItem.Code.Value,
    Name: inventoryItem.Name.Value,
    Description: inventoryItem.Description ?? "",
    FileUrl: inventoryItem.FileUrl?.Value ?? "",
    InventoryTypeId: inventoryItem.InventoryTypeId.Value,
    UnitOfMeasure: new UnitOfMeasureDto(
        Unit: inventoryItem.UnitOfMeasure.Unit,
        Value: inventoryItem.UnitOfMeasure.Value
    ),
    InventoryOwnerShipType: inventoryItem.InventoryOwnerShipType,
    InventoryItemStatus: inventoryItem.Status
    );
    return Result<GetInventoryItemQueryResult>.Success(new GetInventoryItemQueryResult(result));
  }
}