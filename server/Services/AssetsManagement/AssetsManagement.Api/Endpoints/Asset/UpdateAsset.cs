public sealed record UpdateAssetRequest(AssetDto Asset);
public sealed record UpdateAssetResponse(bool IsSuccess);


public class UpdateAsset : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPut("/assets/{id}", async (Guid Id, UpdateAssetRequest request, ISender sender) =>
    {
      var result = await sender.Send(new UpdateAssetCommand(Id, request.Asset));
      var response = result.Value.Adapt<UpdateAssetResponse>();

      return Results.Ok(response);
    })

    .WithName("UpdateAsset")
        .Produces<UpdateAssetResponse>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .WithSummary("Update Asset")
        .WithDescription("Update Asset");
  }
}