public class CreateAssetHandler(IApplicationDbContext context) : ICommandHandler<CreateAssetCommand, Result<CreateAssetCommandResult>>
{
  public async Task<Result<CreateAssetCommandResult>> Handle(CreateAssetCommand command, CancellationToken cancellationToken)
  {
    var asset = CreateAsset(command.Asset);
    await context.Assets.AddAsync(asset);
    return Result<CreateAssetCommandResult>.Success(new CreateAssetCommandResult(asset.Id.Value));
  }

  private Asset CreateAsset(AssetDto asset)
  {
    return Asset.Create(
      assetId: AssetId.Of(Guid.NewGuid()),
      name: Name.Of(asset.Name),
      code: Code.Of(asset.Code),
      description: asset.Description
    );
  }
}