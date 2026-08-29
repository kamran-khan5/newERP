public record CreatePurchaseRequest(PurchaseDto Purchase);
public record CreatePurchaseResponse(Guid Id);

public class CreatePurchase : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPost("/purchases", async (CreatePurchaseRequest request, ISender sender) =>
  {
    var command = request.Adapt<CreatePurchaseCommand>();
    var result = await sender.Send(command);

    var response = result.Value.Adapt<CreatePurchaseResponse>();

    return Results.Created($"/purchases/{response!.Id}", response);
  })
  .WithName("CreatePurchase")
     .Produces<CreatePurchaseResponse>(StatusCodes.Status201Created)
     .ProducesProblem(StatusCodes.Status400BadRequest)
     .WithSummary("Create Purchase")
     .WithDescription("Create Purchase");
  }
}