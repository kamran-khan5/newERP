public sealed record PersonId
{
  public Guid Value { get; }

  private PersonId(Guid value) => Value = value;

  public static PersonId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Raw material Id cannot be empty");
    }
    return new PersonId(value);
  }
}