
public record UpdateInventoryTypeRequest(InventoryTypeDto InventoryType);
public sealed record UpdateInventoryResponse(bool IsSuccess);

public class UpdateInventoryType : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/categories/inventoryTypes/{id}", async (Guid Id, UpdateInventoryTypeRequest request, ISender sender) =>
   {
     var result = await sender.Send(new UpdateInventoryTypeCommand(Id, request.InventoryType));
     var response = result.Value.Adapt<UpdateInventoryResponse>();

     return Results.Ok(response);
   })

   .WithName("UpdateInventoryType")
       .Produces<UpdateInventoryResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Update InventoryType")
       .WithDescription("Update InventoryType");
  }
}