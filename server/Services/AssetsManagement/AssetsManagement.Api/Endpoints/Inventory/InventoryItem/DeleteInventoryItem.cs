public record DeleteInventoryItemResponse(bool IsSuccess);

public class DeleteInventoryItem : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/inventoryItems/{Id}", async (Guid Id, ISender sender) =>
     {
       var result = await sender.Send(new DeleteInventoryItemCommand(Id));
       var response = result.Value.Adapt<DeleteInventoryItemResponse>();
       return Results.Ok(response);
     })
         .WithName("DeleteInventoryItem")
         .Produces<DeleteInventoryItemResponse>(StatusCodes.Status200OK)
         .ProducesProblem(StatusCodes.Status400BadRequest)
         .WithSummary("Delete Inventory Item")
         .WithDescription("Delete Inventory Item");
  }
}