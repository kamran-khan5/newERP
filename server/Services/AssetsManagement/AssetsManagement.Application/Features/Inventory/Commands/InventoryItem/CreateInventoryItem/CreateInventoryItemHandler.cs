using FluentValidation;

public class CreateInventoryItemHandler(IApplicationDbContext context) : ICommandHandler<CreateInventoryItemCommand, Result<CreateInventoryItemResult>>
{
  public async Task<Result<CreateInventoryItemResult>> Handle(CreateInventoryItemCommand command, CancellationToken cancellationToken)
  {
    var item = CreateInventoryItem(command.InventoryItem);
    await context.InventoryItems.AddAsync(item);
    await context.SaveChangesAsync(cancellationToken);
    return Result<CreateInventoryItemResult>.Success(new CreateInventoryItemResult(item.Id.Value));
  }

  private static InventoryItem CreateInventoryItem(InventoryItemDto inventoryItem)
  {
    return InventoryItem.Create(
        inventoryItemId: InventoryItemId.Of(Guid.NewGuid()),
        name: Name.Of(inventoryItem.Name),
        code: Code.Of(inventoryItem.Code),
        description: inventoryItem.Description,
        inventoryTypeId: InventoryTypeId.Of(inventoryItem.InventoryTypeId),
        unitOfMeasure: UnitOfMeasure.Of(
            inventoryItem.UnitOfMeasure.Unit,
            inventoryItem.UnitOfMeasure.Value),
        inventoryOwnerShipType: inventoryItem.InventoryOwnerShipType,
        inventoryItemStatus: inventoryItem.InventoryItemStatus,

        fileUrl: FileUrl.Of(inventoryItem.FileUrl)
    );
  }
}