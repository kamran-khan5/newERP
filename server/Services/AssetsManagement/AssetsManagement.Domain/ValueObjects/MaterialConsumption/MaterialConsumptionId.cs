public sealed record MaterialConsumptionId
{
  public Guid Value { get; }

  private MaterialConsumptionId(Guid value) => Value = value;

  public static MaterialConsumptionId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Material Consumption Id cannot be empty");
    }
    return new MaterialConsumptionId(value);
  }
}