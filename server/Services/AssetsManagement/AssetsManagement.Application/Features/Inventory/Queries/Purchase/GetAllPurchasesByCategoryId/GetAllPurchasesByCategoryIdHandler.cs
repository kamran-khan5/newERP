using Microsoft.EntityFrameworkCore;

public class GetAllPurchasesByCategoryIdHandler(IApplicationDbContext context) : IQueryHandler<GetAllPurchasesByCategoryIdQuery, Result<GetAllPurchasesByCategoryIdQueryResult>>
{
  public async Task<Result<GetAllPurchasesByCategoryIdQueryResult>> Handle(GetAllPurchasesByCategoryIdQuery request, CancellationToken cancellationToken)
  {

    var purchase = await context.PurchaseLines
    .Join(
     context.InventoryItems,
     line => line.ItemId,
     item => item.Id,

    (line, item) => new
    {
      line,
      item
    })
    .Join(
      context.InventoryTypes,
      x => x.item.InventoryTypeId,
      type => type.Id,

      (x, type) => new
      {
        x.line,
        type
      }
    )
    .Where(
      x => x.type.InventoryCategoryId == InventoryCategoryId.Of(request.CategoryId)
      ).ToListAsync();

    var result = purchase
        .Select(p => new PurchaseLineDto(
            Id: p.line.Id.Value,
            ItemId: p.line.ItemId.Value,
            PurchaseId: p.line.PurchaseId.Value,
            OrderedQuantity: p.line.OrderedQuantity,
            ReceivedQuantity: p.line.ReceivedQuantity,

            UnitOfMeasure: new UnitOfMeasureDto(
                Unit: p.line.UnitOfMeasure.Unit,
                Value: p.line.UnitOfMeasure.Value
            ),

            Currency: p.line.UnitPrice.Currency.Value,

            UnitPrice: new MoneyDto(
                Amount: p.line.UnitPrice.Amount,
                Currency: new CurrencyDto(
                    Code: p.line.UnitPrice.Currency.Value
                )
            ),

            DiscountAmount: p.line.DiscountAmount,
            TaxAmount: p.line.TaxAmount,
            Remarks: p.line.Remarks,

            FileUrl:p.line.FileUrl
        ))
        .ToList();

    return Result<GetAllPurchasesByCategoryIdQueryResult>.Success(new GetAllPurchasesByCategoryIdQueryResult(result));
  }
}
