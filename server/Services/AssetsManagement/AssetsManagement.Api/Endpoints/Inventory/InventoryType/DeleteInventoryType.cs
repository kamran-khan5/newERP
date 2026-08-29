public record DeleteInventoryTypeResponse(bool IsSuccess);
public class DeleteInventoryType : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/categories/inventoryTypes/{Id}", async (Guid Id, ISender sender) =>
    {
      var result = await sender.Send(new DeleteInventoryTypeCommand(Id));
      var response = result.Value.Adapt<DeleteInventoryTypeResponse>();
      return Results.Ok(response);
    })
        .WithName("DeleteInventoryType")
        .Produces<DeleteInventoryTypeResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Delete InventoryType")
        .WithDescription("Delete InventoryType");
  }
}