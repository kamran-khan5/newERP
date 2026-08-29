
public record GetInventoryTypesResult(IEnumerable<InventoryTypeDto> InventoryTypes);
public record GetInventoryTypesQuery() : IQuery<Result<GetInventoryTypesResult>>;