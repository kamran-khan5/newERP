public sealed record InventoryCategoryId
{
  public Guid Value { get; }

  private InventoryCategoryId(Guid value) => Value = value;

  public static InventoryCategoryId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Inventory Category Id cannot be empty");
    }
    return new InventoryCategoryId(value);
  }
}