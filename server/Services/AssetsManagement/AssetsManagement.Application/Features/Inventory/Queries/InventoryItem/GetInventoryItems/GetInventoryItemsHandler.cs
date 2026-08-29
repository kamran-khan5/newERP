using Microsoft.EntityFrameworkCore;

public class GetInventoryItemsHandler(IApplicationDbContext context) : IQueryHandler<GetInventoryItemsQuery, Result<GetInventoryItemsQueryResult>>
{
  public async Task<Result<GetInventoryItemsQueryResult>> Handle(GetInventoryItemsQuery query, CancellationToken cancellationToken)
  {
    var items = await context.InventoryTypes
           .Where(i => i.Id == InventoryTypeId.Of(query.Id))
           .Select(x => new GetInventoryItemsQueryResult(
               Id: x.Id.Value,
               InventoryItems: context.InventoryItems
                   .Where(i => i.InventoryTypeId == x.Id)
                   .Select(i => new InventoryItemDto(
                          Id: i.Id.Value,
                          Code: i.Code.Value,
                          Name: i.Name.Value,
                          Description: i.Description ?? "",
                          FileUrl: i.FileUrl.Value ?? "",
                          InventoryTypeId: i.InventoryTypeId.Value,
                          UnitOfMeasure: new UnitOfMeasureDto(
                              i.UnitOfMeasure.Unit,
                              i.UnitOfMeasure.Value
                          ),
                          InventoryOwnerShipType: i.InventoryOwnerShipType,
                          InventoryItemStatus: i.Status
                   ))
                   .ToList()
           ))
           .FirstOrDefaultAsync(cancellationToken);

    if (items == null)
    {
      return Result<GetInventoryItemsQueryResult>.Failure("No items found");
    }

    return Result<GetInventoryItemsQueryResult>.Success(items);
  }
}