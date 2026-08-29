using Microsoft.EntityFrameworkCore;

public class UpdateAssetHandler(IApplicationDbContext context) : ICommandHandler<UpdateAssetCommand, Result<UpdateAssetCommandResult>>
{
  public async Task<Result<UpdateAssetCommandResult>> Handle(UpdateAssetCommand command, CancellationToken cancellationToken)
  {
    var asset = await context.Assets.FirstOrDefaultAsync(a => a.Id == AssetId.Of(command.Id));
    if (asset == null)
    {
      throw new AssetNotFoundException("Asset Not Found");
    }

    UpdateAsset(asset, command.Asset);


    return Result<UpdateAssetCommandResult>.Success(new UpdateAssetCommandResult(true));
  }

  private void UpdateAsset(Asset asset, AssetDto assetDto)
  {
    asset.UpdateAsset(
     name: Name.Of(assetDto.Name),
     code: Code.Of(assetDto.Code),
     description: assetDto.Description
    );
  }
}