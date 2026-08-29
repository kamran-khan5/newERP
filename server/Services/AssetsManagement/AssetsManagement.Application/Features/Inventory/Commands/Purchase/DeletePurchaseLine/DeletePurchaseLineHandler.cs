using Microsoft.EntityFrameworkCore;

public class DeletePurchaseLineHandler(IApplicationDbContext context) : ICommandHandler<DeletePurchaseLineCommand, Result<DeletePurchaseLineCommandResult>>
{
  public async Task<Result<DeletePurchaseLineCommandResult>> Handle(DeletePurchaseLineCommand command, CancellationToken cancellationToken)
  {
    var purchaseLine = await context.PurchaseLines
        .Join(
            context.Purchases,
            line => line.PurchaseId,
            purchase => purchase.Id,
            (line, purchase) => new
            {
              Line = line,
              Purchase = purchase
            })
        .FirstOrDefaultAsync(x => x.Line.Id == PurchaseLineId.Of(command.Id));

    if (purchaseLine == null)
    {
      throw new PurchaseNotFoundException("Purchase Line Not Exist");
    }

    purchaseLine.Purchase.RemovePurchaseLine(PurchaseLineId.Of(command.Id));
    context.PurchaseLines.Remove(purchaseLine.Line);
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeletePurchaseLineCommandResult>.Success(new DeletePurchaseLineCommandResult(true));

  }
}