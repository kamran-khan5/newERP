//Wood, Steel, Plastic (each belongs to ONE category)

public sealed class InventoryType : Entity<InventoryTypeId>
{
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public InventoryCategoryId InventoryCategoryId { get; private set; } = default!;

  public string? Description { get; private set; }

  public static InventoryType Create(InventoryTypeId inventoryTypeId, InventoryCategoryId inventoryCategoryId, Code code, Name name, string description)
  {
    return new InventoryType
    {
      Id = inventoryTypeId,
      InventoryCategoryId = inventoryCategoryId,
      Code = code,
      Name = name,
      Description = description
    };
  }

  public void Update(Code code, Name name, string description)
  {
    Code = code;
    Name = name;
    Description = description;
  }

}