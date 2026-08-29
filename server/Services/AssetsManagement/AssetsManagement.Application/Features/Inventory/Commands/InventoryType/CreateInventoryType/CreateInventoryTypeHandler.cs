public class CreateInventoryTypeHandler(IApplicationDbContext context) : ICommandHandler<CreateInventoryTypeCommand, Result<CreateInventoryTypeResult>>
{
  public async Task<Result<CreateInventoryTypeResult>> Handle(CreateInventoryTypeCommand command, CancellationToken cancellationToken)
  {
    var inventoryType = CreateInventoryType(command.InventoryType);
    await context.InventoryTypes.AddAsync(inventoryType);
    await context.SaveChangesAsync(cancellationToken);
    return Result<CreateInventoryTypeResult>.Success(new CreateInventoryTypeResult(inventoryType.Id.Value));
  }

  private InventoryType CreateInventoryType(InventoryTypeDto inventoryType)
  {
    return InventoryType.Create(InventoryTypeId.Of(Guid.NewGuid()), InventoryCategoryId.Of(inventoryType.InventoryCategoryId), Code.Of(inventoryType.Code), Name.Of(inventoryType.Name), inventoryType.Description);
  }
}