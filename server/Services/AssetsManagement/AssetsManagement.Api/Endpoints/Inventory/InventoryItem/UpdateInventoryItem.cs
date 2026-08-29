public record UpdateInventoryItemRequest(InventoryItemDto InventoryItem);

public record UpdateInventoryItemResponse(bool IsSuccess);

public class UpdateInventoryItem : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/inventoryitems/{id}", async (Guid Id, UpdateInventoryItemRequest request, ISender sender) =>
  {
    var result = await sender.Send(new UpdateInventoryItemCommand(Id, request.InventoryItem));
    var response = result.Value.Adapt<UpdateInventoryItemResponse>();

    return Results.Ok(response);
  })

  .WithName("UpdateInventoryitem")
      .Produces<UpdateInventoryItemResponse>(StatusCodes.Status200OK)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .WithSummary("Update Inventoryitem")
      .WithDescription("Update Inventoryitem");
  }
}