
public sealed record GetAssetResponse(AssetDto Asset);

public class GetAsset : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapGet("/assets/{id}", async (Guid id, ISender sender) =>
   {
     var result = await sender.Send(new GetAssetQuery(id));
     var response = result.Value.Adapt<GetAssetResponse>();

     return Results.Ok(response);
   })
   .WithName("GetAsset")
       .Produces<GetAssetResponse>(StatusCodes.Status200OK)
       .ProducesProblem(StatusCodes.Status400BadRequest)
       .WithSummary("Get Asset")
       .WithDescription("Get Asset");
  }
}
