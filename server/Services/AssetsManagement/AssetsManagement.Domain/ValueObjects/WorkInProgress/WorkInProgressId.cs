public sealed record WorkInProgressId
{
  public Guid Value { get; }

  private WorkInProgressId(Guid value) => Value = value;

  public static WorkInProgressId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Work in progress Id cannot be empty");
    }
    return new WorkInProgressId(value);
  }
}