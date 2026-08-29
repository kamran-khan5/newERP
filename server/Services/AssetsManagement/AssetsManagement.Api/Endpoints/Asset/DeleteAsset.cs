public sealed record DeleteAssetResponse(bool IsSuccess);


public class DeleteAsset : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapDelete("/assets/{Id}", async (Guid Id, ISender sender) =>
    {
      var result = await sender.Send(new DeleteAssetCommand(Id));
      var response = result.Value.Adapt<DeleteAssetResponse>();
      return Results.Ok(response);
    })
        .WithName("DeleteAsset")
        .Produces<DeleteAssetResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Delete Asset")
        .WithDescription("Delete Asset");
  }
}