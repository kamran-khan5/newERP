using Mapster;

public class CreatePurchaseHandler(IApplicationDbContext context) : ICommandHandler<CreatePurchaseCommand, Result<CreatePurchaseCommandResult>>
{
  public async Task<Result<CreatePurchaseCommandResult>> Handle(CreatePurchaseCommand command, CancellationToken cancellationToken)
  {
    var purchase = CreatePurchase(command.Purchase);
    await context.Purchases.AddAsync(purchase);
    await context.SaveChangesAsync(cancellationToken);
    return Result<CreatePurchaseCommandResult>.Success(new CreatePurchaseCommandResult(purchase.Id.Value));
  }

  private Purchase CreatePurchase(PurchaseDto purchaseDto)
  {
    var purchase = Purchase.Create(
            purchaseId: PurchaseId.Of(Guid.NewGuid()),
            supplierId: PersonId.Of(purchaseDto.SupplierId),
            purchaseDate: purchaseDto.PurchaseDate,
            purchaseStatus: purchaseDto.Status,
            currency: Currency.Of(purchaseDto.Currency),
            deliveryAddress: Address.Of(
            purchaseDto.DeliveryAddress.Street,
            purchaseDto.DeliveryAddress.Building,
            purchaseDto.DeliveryAddress.City,
            purchaseDto.DeliveryAddress.State,
            purchaseDto.DeliveryAddress.PostalCode,
            purchaseDto.DeliveryAddress.Country,
            purchaseDto.DeliveryAddress.Longitude,
            purchaseDto.DeliveryAddress.Latitude),
            expectedDeliveryDate: purchaseDto.ExpectedDeliveryDate,
            paymentTerm: PaymentTerm.Of(
                purchaseDto.PaymentTerm.Code,
                purchaseDto.PaymentTerm.DueDays,
                purchaseDto.PaymentTerm.AdvancePercentage),
          remarks: purchaseDto.Remarks
        );

    var lines = purchaseDto.Lines.Select(

      pl => PurchaseLine.Create(
            purchaseLineId: PurchaseLineId.Of(Guid.NewGuid()),
            purchaseId: PurchaseId.Of(purchase.Id.Value),
            inventoryItemId: InventoryItemId.Of(pl.ItemId),
            orderedQuantity: pl.OrderedQuantity,
            receivedQuantity: pl.ReceivedQuantity,
            unitOfMeasure: UnitOfMeasure.Of(pl.UnitOfMeasure.Unit, pl.UnitOfMeasure.Value),
            unitPrice: Money.Of(pl.UnitPrice.Amount, Currency.Of(pl.Currency)),
            discountAmount: pl.DiscountAmount,
            taxAmount: pl.TaxAmount,
            remarks: pl.Remarks,
            fileUrl:pl.FileUrl

        )
    ).ToList();

    purchase.AddPurchaseLine(lines);

    return purchase;
  }
}