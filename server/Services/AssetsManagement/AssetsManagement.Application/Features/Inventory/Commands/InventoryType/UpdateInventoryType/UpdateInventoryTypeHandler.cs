using Microsoft.EntityFrameworkCore;

public class UpdateInventoryTypeHandler(IApplicationDbContext context) : ICommandHandler<UpdateInventoryTypeCommand, Result<UpdateInventoryTypeResult>>
{
  public async Task<Result<UpdateInventoryTypeResult>> Handle(UpdateInventoryTypeCommand command, CancellationToken cancellationToken)
  {
    var inventory = await context.InventoryTypes.FirstOrDefaultAsync(x => x.Id == InventoryTypeId.Of(command.Id));
    if (inventory == null)
    {
      throw new InventoryNotFoundException("Inventory Type NotFound");
    }

    UpdateInventoryType(inventory, command.InventoryType);
    await context.SaveChangesAsync(cancellationToken);
    return Result<UpdateInventoryTypeResult>.Success(new UpdateInventoryTypeResult(true));
  }

  private void UpdateInventoryType(InventoryType inventoryType, InventoryTypeDto inventoryTypeDto)
  {
    inventoryType.Update(Code.Of(inventoryTypeDto.Code), Name.Of(inventoryTypeDto.Name), inventoryTypeDto.Description ?? "");
  }
}