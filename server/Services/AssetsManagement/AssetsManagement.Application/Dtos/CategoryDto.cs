public sealed record CategoryDto(
  Guid Id,
  string Code,
  string Name,
  string Description,
  bool IsActive
);