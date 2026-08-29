public sealed record WarehouseId
{
  public Guid Value { get; }

  private WarehouseId(Guid value) => Value = value;

  public static WarehouseId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Warehouse Id cannot be empty");
    }
    return new WarehouseId(value);
  }
}