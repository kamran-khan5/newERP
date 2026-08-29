
public record GetCategoriesResponse(IEnumerable<CategoryDto> Categories);


public class GetCategories : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/categories", async (ISender sender) =>
    {
      var result = await sender.Send(new GetCategoriesQuery());
      var response = result.Value.Adapt<GetCategoriesResponse>();

      return Results.Ok(response);
    })
    .WithName("GetCategories")
        .Produces<GetCategoriesResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Get categories")
        .WithDescription("Get categories");
  }
}