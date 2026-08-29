
public sealed record GetCategoryResponse(CategoryDto Category);

public class GetCategory : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/categories/{id}", async (Guid id, ISender sender) =>
   {
     var result = await sender.Send(new GetCategoryQuery(id));
     var response = result.Value.Adapt<GetCategoryResponse>();

     return Results.Ok(response);
   })
   .WithName("GetCategory")
       .Produces<GetCategoryResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Get category")
       .WithDescription("Get category");
  }
}