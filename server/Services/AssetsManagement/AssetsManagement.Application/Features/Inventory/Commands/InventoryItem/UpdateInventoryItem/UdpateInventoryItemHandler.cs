using Mapster;
using Microsoft.EntityFrameworkCore;

public class UdpateInventoryItemHandler(IApplicationDbContext context) : ICommandHandler<UpdateInventoryItemCommand, Result<UpdateInventoryItemResult>>
{
  public async Task<Result<UpdateInventoryItemResult>> Handle(UpdateInventoryItemCommand command, CancellationToken cancellationToken)
  {
    var item = await context.InventoryItems.FirstOrDefaultAsync(i => i.Id == InventoryItemId.Of(command.Id));
    if (item == null)
    {
      throw new InventoryItemNotFoundException("Inventory Item not Found");
    }
    UpdateInventoryItem(item, command.InventoryItem);
    await context.SaveChangesAsync(cancellationToken);
    return Result<UpdateInventoryItemResult>.Success(new UpdateInventoryItemResult(true));
  }

  private void UpdateInventoryItem(InventoryItem item, InventoryItemDto inventoryItem)
  {
    item.Update(
    name: Name.Of(inventoryItem.Name),
    description: inventoryItem.Description,
    inventoryTypeId: InventoryTypeId.Of(inventoryItem.InventoryTypeId),
    unitOfMeasure: UnitOfMeasure.Of(inventoryItem.UnitOfMeasure.Unit, inventoryItem.UnitOfMeasure.Value),
    inventoryOwnerShipType: inventoryItem.InventoryOwnerShipType,
    inventoryItemStatus: inventoryItem.InventoryItemStatus,

    fileUrl:FileUrl.Of(inventoryItem.FileUrl)
    );
  }
}