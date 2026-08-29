public sealed record GetPurchaseQueryResponse(PurchaseDto Purchase);
public class GetPurchase : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/purchases/{id}", async (Guid id, ISender sender) =>
{
  var result = await sender.Send(new GetPurchaseQuery(id));
  var response = result.Value.Adapt<GetPurchaseQueryResponse>();

  return Results.Ok(response);
})
.WithName("GetPurchase")
  .Produces<GetPurchaseQueryResponse>(StatusCodes.Status200OK)
  .ProducesProblem(StatusCodes.Status400BadRequest)
  .WithSummary("Get Purchase")
  .WithDescription("Get Purchase");
  }
}