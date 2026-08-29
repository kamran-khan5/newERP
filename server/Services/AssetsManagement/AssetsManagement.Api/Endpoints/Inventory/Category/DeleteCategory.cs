
public record DeleteCategoryResponse(bool IsSuccess);

public class DeleteCategory : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/categories/{Id}", async (Guid Id, ISender sender) =>
     {
       var result = await sender.Send(new DeleteCategoryCommand(Id));
       var response = result.Value.Adapt<DeleteCategoryResponse>();
       return Results.Ok(response);
     })
         .WithName("DeleteCategory")
         .Produces<DeleteCategoryResponse>(StatusCodes.Status200OK)
         .ProducesProblem(StatusCodes.Status400BadRequest)
         .WithSummary("Delete Category")
         .WithDescription("Delete Category");
  }
}