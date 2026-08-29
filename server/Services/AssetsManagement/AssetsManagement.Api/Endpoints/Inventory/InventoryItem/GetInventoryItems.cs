public record GetInventoryItemsResponse(IList<InventoryItemDto> InventoryItems);

public class GetInventoryItems : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    {
      app.MapGet("/inventoryitems/{inventoryTypeId}", async (Guid inventoryTypeId, ISender sender) =>
  {
    var result = await sender.Send(new GetInventoryItemsQuery(inventoryTypeId));
    var response = result.Value.Adapt<GetInventoryItemsResponse>();

    return Results.Ok(response);
  })
  .WithName("GetInventoryItems")
     .Produces<GetInventoryItemsResponse>(StatusCodes.Status200OK)
     .ProducesProblem(StatusCodes.Status400BadRequest)
     .WithSummary("Get InventoryItems")
     .WithDescription("Get InventoryItems");
    }
  }
}