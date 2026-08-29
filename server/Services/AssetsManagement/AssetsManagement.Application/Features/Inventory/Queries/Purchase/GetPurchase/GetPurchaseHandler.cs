using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetPurchaseHandler(IApplicationDbContext context) : IQueryHandler<GetPurchaseQuery, Result<GetPurchaseQueryResult>>
{
  public async Task<Result<GetPurchaseQueryResult>> Handle(GetPurchaseQuery query, CancellationToken cancellationToken)
  {
    var purchase = await context.Purchases.
     Where(p => p.Id == PurchaseId.Of(query.Id))
     .Select(p => new
     {
       Purchase = p,
       Lines = context.PurchaseLines
        .Where(pl => pl.PurchaseId == p.Id)
            .ToList()
     }).FirstOrDefaultAsync(cancellationToken)
    ;
    if (purchase == null)
    {
      throw new PurchaseNotFoundException("Purchase does Not Exist");
    }
    var result = new PurchaseDto(
        Id: purchase.Purchase.Id.Value,
        SupplierId: purchase.Purchase.SupplierId.Value,
        PurchaseDate: purchase.Purchase.PurchaseDate,
        Status: purchase.Purchase.Status,
        Currency: purchase.Purchase.Currency.Value,

        DeliveryAddress: new AddressDto(
            purchase.Purchase.DeliveryAddress.Street,
            purchase.Purchase.DeliveryAddress.Building,
            purchase.Purchase.DeliveryAddress.City,
            purchase.Purchase.DeliveryAddress.State,
            purchase.Purchase.DeliveryAddress.PostalCode,
            purchase.Purchase.DeliveryAddress.Country,
            purchase.Purchase.DeliveryAddress.Longitude,
            purchase.Purchase.DeliveryAddress.Latitude
        ),

        ExpectedDeliveryDate: purchase.Purchase.ExpectedDeliveryDate,

        PaymentTerm: new PaymentTermDto(
            purchase.Purchase.PaymentTerm.Code,
            purchase.Purchase.PaymentTerm.DueDays,
            purchase.Purchase.PaymentTerm.AdvancePercentage
        ),

        Remarks: purchase.Purchase.Remarks,

        Lines: purchase.Lines
            .Select(line => new PurchaseLineDto(
                Id: line.Id.Value,
                ItemId: line.ItemId.Value,
                PurchaseId: line.PurchaseId.Value,
                OrderedQuantity: line.OrderedQuantity,
                ReceivedQuantity: line.ReceivedQuantity,

                UnitOfMeasure: new UnitOfMeasureDto(
                    Unit: line.UnitOfMeasure.Unit,
                    Value: line.UnitOfMeasure.Value
                ),

                Currency: line.UnitPrice.Currency.Value,

                UnitPrice: new MoneyDto(
                    line.UnitPrice.Amount,
                    new CurrencyDto(
                        Code: line.UnitPrice.Currency.Value
                    )
                ),

                DiscountAmount: line.DiscountAmount,
                TaxAmount: line.TaxAmount,
                Remarks: line.Remarks,
                FileUrl: line.FileUrl
            ))
            .ToList()
    );
    return Result<GetPurchaseQueryResult>.Success(new GetPurchaseQueryResult(result));
  }
}