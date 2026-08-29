using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetPurchaseLineHandler(IApplicationDbContext context) : IQueryHandler<GetPurchaseLineQuery, Result<GetPurchaseLineQueryResult>>
{
  public async Task<Result<GetPurchaseLineQueryResult>> Handle(GetPurchaseLineQuery query, CancellationToken cancellationToken)
  {
    var line = await context.PurchaseLines.FirstOrDefaultAsync(l => l.Id == PurchaseLineId.Of(query.Id));
    if (line == null)
    {
      throw new PurchaseNotFoundException("Purchase Line does not exist");
    }

    var result = line.Adapt<PurchaseLineDto>();
    return Result<GetPurchaseLineQueryResult>.Success(new GetPurchaseLineQueryResult(result));
  }
}