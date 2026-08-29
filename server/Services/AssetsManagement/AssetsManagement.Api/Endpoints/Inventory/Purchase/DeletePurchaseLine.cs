public record DeletePurchaseLineResponse(bool IsSuccess);


public class DeletePurchaseLine : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/purchases/purchaseLine/{id}", async (Guid Id, ISender sender) =>
    {
      var result = await sender.Send(new DeletePurchaseLineCommand(Id));
      var response = result.Value.Adapt<DeletePurchaseLineResponse>();
      return Results.Ok(response);
    })
        .WithName("DeletePurchaseLine")
        .Produces<DeletePurchaseLineResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Delete purchase Line")
        .WithDescription("Delete purchase Line");
  }
}