public sealed record InventoryStockId
{
  public Guid Value { get; }

  private InventoryStockId(Guid value) => Value = value;

  public static InventoryStockId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Inventory Category Id cannot be empty");
    }
    return new InventoryStockId(value);
  }
}