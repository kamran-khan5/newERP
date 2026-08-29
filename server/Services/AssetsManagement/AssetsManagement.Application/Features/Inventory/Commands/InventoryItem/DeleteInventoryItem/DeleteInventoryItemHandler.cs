using Microsoft.EntityFrameworkCore;

public class DeleteInventoryItemHandler(IApplicationDbContext context) : ICommandHandler<DeleteInventoryItemCommand, Result<DeleteInventoryItemResult>>
{
  public async Task<Result<DeleteInventoryItemResult>> Handle(DeleteInventoryItemCommand command, CancellationToken cancellationToken)
  {
    var item = await context.InventoryItems.FirstOrDefaultAsync(i => i.Id == InventoryItemId.Of(command.Id));
    if (item == null)
    {
      throw new InventoryItemNotFoundException("Inventory Item not Found");
    }
    context.InventoryItems.Remove(item);
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeleteInventoryItemResult>.Success(new DeleteInventoryItemResult(true));
  }
}