
public record GetInventoryTypesResponse(IEnumerable<InventoryTypeDto> InventoryTypes);
public class GetInventoryTypes : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/categories/inventoryTypes", async (ISender sender) =>
{
  var result = await sender.Send(new GetInventoryTypesQuery());
  var response = result.Value.Adapt<GetInventoryTypesResponse>();

  return Results.Ok(response);
})
.WithName("GetInventoryTypes")
    .Produces<GetInventoryTypesResponse>(StatusCodes.Status200OK)
    .ProducesProblem(StatusCodes.Status400BadRequest)
    .WithSummary("Get categories")
    .WithDescription("Get categories");
  }
}