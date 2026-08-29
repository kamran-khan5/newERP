using Microsoft.EntityFrameworkCore;

public class DeleteAssetHandler(IApplicationDbContext context) : ICommandHandler<DeleteAssetCommand, Result<DeleteAssetCommandResult>>
{
  public async Task<Result<DeleteAssetCommandResult>> Handle(DeleteAssetCommand command, CancellationToken cancellationToken)
  {
    var asset = await context.Assets.FirstOrDefaultAsync(a => a.Id == AssetId.Of(command.Id));
    if (asset == null)
    {
      throw new AssetNotFoundException("Asset Not Found");
    }
    await context.SaveChangesAsync(cancellationToken);
    return Result<DeleteAssetCommandResult>.Success(new DeleteAssetCommandResult(true));
  }
}