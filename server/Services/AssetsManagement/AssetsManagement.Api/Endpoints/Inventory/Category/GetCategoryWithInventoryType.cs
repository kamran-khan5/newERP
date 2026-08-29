public record GetCategoryWithInventoryTypeResponse(Guid CategoryId,
  IList<InventoryTypeDto> InventoryTypes);
public class GetCategoryWithInventoryType : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/categories/{id}/inventoryTypes", async (Guid id, ISender sender) =>
   {
     var result = await sender.Send(new GetCategoryWithInventoryTypesQuery(id));
     var response = result.Value.Adapt<GetCategoryWithInventoryTypeResponse>();
     return Results.Ok(response);
   })
   .WithName("GetCategoryWithInventoryTypes")
       .Produces<GetCategoryWithInventoryTypeResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Get category with Inventory Types")
       .WithDescription("Get category with Inventory Types");
  }
}
