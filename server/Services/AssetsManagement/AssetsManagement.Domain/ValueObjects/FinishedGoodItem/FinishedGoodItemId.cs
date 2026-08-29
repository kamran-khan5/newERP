public sealed record FinishedGoodItemId
{
  public Guid Value { get; }

  private FinishedGoodItemId(Guid value) => Value = value;

  public static FinishedGoodItemId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Finished Good Item Id cannot be empty");
    }
    return new FinishedGoodItemId(value);
  }
}