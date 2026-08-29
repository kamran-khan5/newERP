public sealed record ProductionOrderId
{
  public Guid Value { get; }

  private ProductionOrderId(Guid value) => Value = value;

  public static ProductionOrderId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Production Order Id cannot be empty");
    }
    return new ProductionOrderId(value);
  }
}