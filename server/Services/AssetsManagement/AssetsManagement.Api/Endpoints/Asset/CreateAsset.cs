public sealed record CreateAssetRequest(AssetDto Asset);
public record CreateAssetResponse(Guid Id);

public class CreateAsset : ICarterModule
{
  public void AddRoutes(IEndpointRouteBuilder app)
  {
    app.MapPost("/assets", async (CreateAssetRequest request, ISender sender) =>
  {
    var command = request.Adapt<CreateAssetCommand>();
    var result = await sender.Send(command);

    var response = result.Value.Adapt<CreateAssetResponse>();

    return Results.Created($"/categories/{response!.Id}", response);
  })
   .WithName("CreateAsset")
      .Produces<CreateAssetResponse>(StatusCodes.Status201Created)
      .ProducesProblem(StatusCodes.Status400BadRequest)
      .WithSummary("Create Asset")
      .WithDescription("Create Asset");
  }
}