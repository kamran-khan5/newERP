using Microsoft.EntityFrameworkCore;

public class UpdatePurchaseLineHandler(IApplicationDbContext context) : ICommandHandler<UpdatePurchaseLineCommand, Result<UpdatePurchaseLineCommandResult>>
{
    public async Task<Result<UpdatePurchaseLineCommandResult>> Handle(UpdatePurchaseLineCommand command, CancellationToken cancellationToken)
    {
        var purchaseLine = await context.PurchaseLines
           .FirstOrDefaultAsync(p => p.Id == PurchaseLineId.Of(command.Id));

        if (purchaseLine == null)
        {
            throw new PurchaseNotFoundException("No Purchase Line Exist");
        }

        UpdatePurchaseLine(purchaseLine, command.PurchaseLine);
        await context.SaveChangesAsync(cancellationToken);
        return Result<UpdatePurchaseLineCommandResult>.Success(new UpdatePurchaseLineCommandResult(true));
    }


    private void UpdatePurchaseLine(
        PurchaseLine line,
        PurchaseLineDto lineDto)
    {
        var unitPrice = Money.Of(
            lineDto.UnitPrice.Amount,
            Currency.Of(
                lineDto.UnitPrice.Currency.Code));
        line.Update(
            inventoryItemId:
                InventoryItemId.Of(
                    lineDto.ItemId),

            orderedQuantity:
                lineDto.OrderedQuantity,

            receivedQuantity:
                lineDto.ReceivedQuantity,

            unitOfMeasure:
                UnitOfMeasure.Of(
                    lineDto.UnitOfMeasure.Unit,
                    lineDto.UnitOfMeasure.Value),

            unitPrice:
                unitPrice,

            discountAmount: lineDto.DiscountAmount,

            taxAmount:
                lineDto.TaxAmount,

            remarks:
                lineDto.Remarks,

            fileUrl: lineDto.FileUrl
                );
    }
}