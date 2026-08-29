using Mapster;
using Microsoft.EntityFrameworkCore;

public class GetAssetHandler(IApplicationDbContext context) : ICommandHandler<GetAssetQuery, Result<GetAssetQueryResult>>
{
  public async Task<Result<GetAssetQueryResult>> Handle(GetAssetQuery query, CancellationToken cancellationToken)
  {
    var asset = await context.Assets.FirstOrDefaultAsync(a => a.Id == AssetId.Of(query.Id));
    if (asset == null)
    {
      throw new AssetNotFoundException("Asset Not Found");
    }

    var result = new AssetDto(Id: asset.Id.Value, Code: asset.Code.Value, Name: asset.Name.Value, Description: asset.Description ?? "");
    return Result<GetAssetQueryResult>.Success(new GetAssetQueryResult(result));
  }
}