using Mapster;
using Microsoft.EntityFrameworkCore;

public class UpdatePurchaseHandler(IApplicationDbContext context) : ICommandHandler<UpdatePurchaseCommand, Result<UpdatePurchaseCommandResult>>
{
  public async Task<Result<UpdatePurchaseCommandResult>> Handle(UpdatePurchaseCommand command, CancellationToken cancellationToken)
  {
    var purchase = await context.Purchases
    .FirstOrDefaultAsync(p => p.Id == PurchaseId.Of(command.Id));

    if (purchase == null)
    {
      throw new PurchaseNotFoundException("No Purchases Exist");
    }

    UpdatePurchase(purchase, command.Purchase);
    await context.SaveChangesAsync(cancellationToken);
    return Result<UpdatePurchaseCommandResult>.Success(new UpdatePurchaseCommandResult(true));
  }

  private void UpdatePurchase(
      Purchase purchase,
      PurchaseDto purchaseDto)
  {
    var currency = Currency.Of(purchaseDto.Currency);

    var address = Address.Of(
        purchaseDto.DeliveryAddress.Street,
        purchaseDto.DeliveryAddress.Building,
        purchaseDto.DeliveryAddress.City,
        purchaseDto.DeliveryAddress.State,
        purchaseDto.DeliveryAddress.PostalCode,
        purchaseDto.DeliveryAddress.Country,
        purchaseDto.DeliveryAddress.Longitude,
        purchaseDto.DeliveryAddress.Latitude);

    var paymentTerm = PaymentTerm.Of(
        purchaseDto.PaymentTerm.Code,
        purchaseDto.PaymentTerm.DueDays,
        purchaseDto.PaymentTerm.AdvancePercentage
        );

    purchase.Update(
        supplierId: PersonId.Of(purchaseDto.SupplierId),
        purchaseDate: purchaseDto.PurchaseDate,
        currency: currency,
        deliveryAddress: address,
        expectedDeliveryDate: purchaseDto.ExpectedDeliveryDate,
        paymentTerm: paymentTerm,
        status: purchaseDto.Status,
        remarks: purchaseDto.Remarks
        );


    foreach (var p in purchase.Lines)
    {
      p.Update(
       inventoryItemId: InventoryItemId.Of(p.ItemId.Value),

       orderedQuantity: p.OrderedQuantity,

       receivedQuantity: p.ReceivedQuantity,

       unitOfMeasure: UnitOfMeasure.Of(p.UnitOfMeasure.Unit, p.UnitOfMeasure.Value),

       unitPrice: Money.Of(
         amount: p.UnitPrice.Amount,

         currency:Currency.Of(p.UnitPrice.Currency.Value)
       ),

       discountAmount: p.DiscountAmount,

       taxAmount: p.TaxAmount,

       remarks: p.Remarks,
       fileUrl: p.FileUrl
      );
    }
  }



}

