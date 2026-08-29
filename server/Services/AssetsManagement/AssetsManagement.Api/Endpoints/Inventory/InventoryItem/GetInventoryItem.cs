public record GetInventoryItemResponse(InventoryItemDto InventoryItem);


public class GetInventoryItem : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/inventoryitem/{id}", async (Guid id, ISender sender) =>
{
  var result = await sender.Send(new GetInventoryItemQuery(id));
  var response = result.Value.Adapt<GetInventoryItemResponse>();

  return Results.Ok(response);
})
.WithName("GetInventoryItem")
   .Produces<GetInventoryItemResponse>(StatusCodes.Status200OK)
   .ProducesProblem(StatusCodes.Status400BadRequest)
   .WithSummary("Get InventoryItem")
   .WithDescription("Get InventoryItem");
  }
}