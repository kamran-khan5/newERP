public record DeletePurchaseResponse(bool IsSuccess);


public class DeletePurchase : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/purchases/{id}", async (Guid Id, ISender sender) =>
    {
      var result = await sender.Send(new DeletePurchaseCommand(Id));
      var response = result.Value.Adapt<DeletePurchaseResponse>();
      return Results.Ok(response);
    })
        .WithName("DeletePurchase")
        .Produces<DeletePurchaseResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Delete purchase")
        .WithDescription("Delete purchase");
  }
}