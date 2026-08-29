using Microsoft.EntityFrameworkCore;

public class RemovePurchaseHandler(IApplicationDbContext context) : ICommandHandler<DeletePurchaseCommand, Result<DeletePurchaseCommandResult>>
{
  public async Task<Result<DeletePurchaseCommandResult>> Handle(DeletePurchaseCommand command, CancellationToken cancellationToken)
  {
    var purchase = await context.Purchases.FirstOrDefaultAsync(l => l.Id == PurchaseId.Of(command.Id));
    if (purchase == null)
    {
      throw new PurchaseNotFoundException("Purchase Line Not Exist");
    }

    context.Purchases.Remove(purchase);
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeletePurchaseCommandResult>.Success(new DeletePurchaseCommandResult(true));
  }
}