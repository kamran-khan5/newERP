public record GetInventoryTypeResponse(InventoryTypeDto InventoryType);

public class GetInventoryType : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/categories/inventoryTypes/{id}", async (Guid id, ISender sender) =>
   {
     var result = await sender.Send(new GetInventoryTypeQuery(id));
     var response = result.Value.Adapt<GetInventoryTypeResponse>();

     return Results.Ok(response);
   })
   .WithName("GetInventory")
       .Produces<GetInventoryTypeResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Get Inventory")
       .WithDescription("Get Inventory");
  }
}