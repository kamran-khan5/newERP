public sealed record PurchaseId
{
  public Guid Value { get; }

  private PurchaseId(Guid value) => Value = value;

  public static PurchaseId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Purchase Id cannot be empty");
    }
    return new PurchaseId(value);
  }
}