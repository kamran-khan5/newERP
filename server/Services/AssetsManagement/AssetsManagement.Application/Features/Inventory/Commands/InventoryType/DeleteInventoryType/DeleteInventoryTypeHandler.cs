using Microsoft.EntityFrameworkCore;

public class DeleteInventoryTypeHandler(IApplicationDbContext context) : ICommandHandler<DeleteInventoryTypeCommand, Result<DeleteInventoryTypeResult>>
{
  public async Task<Result<DeleteInventoryTypeResult>> Handle(DeleteInventoryTypeCommand command, CancellationToken cancellationToken)
  {
    var inventory = await context.InventoryTypes.FirstOrDefaultAsync(x => x.Id == InventoryTypeId.Of(command.Id), cancellationToken);
    if (inventory == null)
    {
      throw new InventoryNotFoundException("Inventory Type NotFound");
    }
    context.InventoryTypes.Remove(inventory);
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeleteInventoryTypeResult>.Success(new DeleteInventoryTypeResult(true));
  }
}