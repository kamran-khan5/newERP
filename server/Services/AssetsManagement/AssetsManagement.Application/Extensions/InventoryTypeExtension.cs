public static class InventoryTypeExtension
{
  public static IEnumerable<InventoryTypeDto> ToInventoryTypeList(this IEnumerable<InventoryType> inventoryTypes)
  {
    return inventoryTypes.Select(i => new InventoryTypeDto(
      Id: i.Id.Value,
      Code: i.Code.Value,
      Name: i.Name.Value,
      Description: i.Description ?? "",
      InventoryCategoryId: i.InventoryCategoryId.Value
    ));
  }
}