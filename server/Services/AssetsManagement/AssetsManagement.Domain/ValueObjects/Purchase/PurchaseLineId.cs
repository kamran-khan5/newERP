public sealed record PurchaseLineId
{
  public Guid Value { get; }

  private PurchaseLineId(Guid value) => Value = value;

  public static PurchaseLineId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Purchase Line Id cannot be empty");
    }
    return new PurchaseLineId(value);
  }
}