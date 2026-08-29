public sealed record InventoryTypeDto(
  Guid Id,
  string Code,
  string Name,
  string Description,
  Guid InventoryCategoryId
);