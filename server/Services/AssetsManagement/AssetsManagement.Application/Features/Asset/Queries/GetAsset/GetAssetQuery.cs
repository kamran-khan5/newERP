public sealed record GetAssetQueryResult(AssetDto Asset);

public sealed record GetAssetQuery(Guid Id) : ICommand<Result<GetAssetQueryResult>>;