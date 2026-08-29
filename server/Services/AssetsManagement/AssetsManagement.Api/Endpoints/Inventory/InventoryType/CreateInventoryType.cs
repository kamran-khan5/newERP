public sealed record CreateInventoryTypeRequest(InventoryTypeDto InventoryType);
public sealed record CreateInventoryTypeResponse(Guid Id);


public class CreateInventoryType : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPost("/categories/inventoryTypes", async (CreateInventoryTypeRequest request, ISender sender) =>
   {
     var command = request.Adapt<CreateInventoryTypeCommand>();
     var result = await sender.Send(command);

     var response = result.Value.Adapt<CreateInventoryTypeResponse>();

     return Results.Created($"/categories/inventoryTypes/{response!.Id}", response);
   })
    .WithName("CreateInventoryType")
       .Produces<CreateInventoryTypeResponse>(StatusCodes.Status201Created)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Create InventoryType")
       .WithDescription("Create InventoryType");
  }
}