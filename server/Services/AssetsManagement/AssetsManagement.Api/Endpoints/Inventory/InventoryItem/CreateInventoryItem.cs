public record CreateInventoryItemRequest(InventoryItemDto InventoryItem);
public record CreateInventoryItemResponse(Guid Id);


public class CreateInventoryItem : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPost("/inventoryitems", async (CreateInventoryItemRequest request, ISender sender) =>
   {
     var command = request.Adapt<CreateInventoryItemCommand>();
     var result = await sender.Send(command);

     var response = result.Value.Adapt<CreateInventoryItemResponse>();

     return Results.Created($"/inventoryitems/{response!.Id}", response);
   })
    .WithName("CreateInventoryItem")
       .Produces<CreateInventoryItemResponse>(StatusCodes.Status201Created)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Create InventoryItem")
       .WithDescription("Create InventoryItem");
  }
}