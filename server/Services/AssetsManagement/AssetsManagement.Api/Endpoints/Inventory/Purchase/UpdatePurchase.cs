public sealed record UpdatePurchaseRequest(PurchaseDto Purchase);
public sealed record UpdatePurchaseResponse(bool IsSuccess);

public class UpdatePurchase : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/purchases/{id}", async (Guid Id, UpdatePurchaseRequest request, ISender sender) =>
{
  var result = await sender.Send(new UpdatePurchaseCommand(Id, request.Purchase));
  var response = result.Value.Adapt<UpdatePurchaseResponse>();

  return Results.Ok(response);
})

.WithName("UpdatePurchase")
   .Produces<UpdatePurchaseResponse>(StatusCodes.Status200OK)
   .ProducesProblem(StatusCodes.Status400BadRequest)
   .WithSummary("Update Purchase")
   .WithDescription("Update Purchase");
  }
}