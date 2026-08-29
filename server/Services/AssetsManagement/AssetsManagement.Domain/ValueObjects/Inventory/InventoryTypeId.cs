public sealed record InventoryTypeId
{
  public Guid Value { get; }

  private InventoryTypeId(Guid value) => Value = value;

  public static InventoryTypeId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("InventoryType Id cannot be empty");
    }
    return new InventoryTypeId(value);
  }
}