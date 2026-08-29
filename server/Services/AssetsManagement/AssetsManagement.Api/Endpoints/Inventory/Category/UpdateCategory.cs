public sealed record UpdateCategoryRequest(CategoryDto Category);
public sealed record UpdateCategoryResponse(bool IsSuccess);

public class UpdateCategory : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/categories/{id}", async (Guid Id, UpdateCategoryRequest request, ISender sender) =>
    {
      var result = await sender.Send(new UpdateCategoryCommand(Id, request.Category));
      var response = result.Value.Adapt<UpdateCategoryResponse>();

      return Results.Ok(response);
    })

    .WithName("UpdateCategory")
        .Produces<UpdateCategoryResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Category")
        .WithDescription("Update Category");
  }
}