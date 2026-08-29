
public sealed record UpdatePurchaseLineRequest(PurchaseLineDto PurchaseLine);
public sealed record UpdatePurchaseLineResponse(bool IsSuccess);
public class UpdatePurchaseLine : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/purchases/purchaseLine/{id}", async (Guid Id, UpdatePurchaseLineRequest request, ISender sender) =>
{
  var result = await sender.Send(new UpdatePurchaseLineCommand(Id, request.PurchaseLine));
  var response = result.Value.Adapt<UpdatePurchaseLineResponse>();

  return Results.Ok(response);
})

.WithName("UpdatePurchaseLine")
.Produces<UpdatePurchaseLineResponse>(StatusCodes.Status200OK)
.ProducesProblem(StatusCodes.Status400BadRequest)
.WithSummary("Update Purchase Line")
.WithDescription("Update Purchase Line");
  }
}