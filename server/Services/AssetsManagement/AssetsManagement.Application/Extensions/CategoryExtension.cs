public static class CategoryExtension
{
  public static IEnumerable<CategoryDto> ToCategoryList(this IEnumerable<InventoryCategory> categories)
  {
    return categories.Select(x => new CategoryDto(
      Id: x.Id.Value,
      Code: x.Code.Value,
      Name: x.Name.Value,
      Description: x.Description ?? "Not Provided",
      IsActive: x.IsActive
    )).ToList();
  }
}