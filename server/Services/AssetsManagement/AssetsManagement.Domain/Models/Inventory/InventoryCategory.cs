//Example
// Raw Material
// Finished Goods
// Consumables
// Spare Parts

public sealed class InventoryCategory : Entity<InventoryCategoryId>
{
  // public InventoryTypeId InventoryTypeId { get; private set; } = default!;
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public string Description { get; private set; } = default!;
  public bool IsActive { get; private set; }
  public static InventoryCategory Create(InventoryCategoryId inventoryCategoryId, Code code, Name name, string description, bool isActive)
  {
    return new InventoryCategory
    {
      Id = inventoryCategoryId,
      Code = code,
      Name = name,
      Description = description,
      IsActive = isActive
    };
  }

  public void Update(Code code, Name name, string description, bool isActive)
  {
    Code = code;
    Name = name;
    Description = description;
    IsActive = isActive;
  }

  public void Activate()
  {
    IsActive = true;
  }
  public void Deactivate()
  {
    IsActive = false;
  }
}
