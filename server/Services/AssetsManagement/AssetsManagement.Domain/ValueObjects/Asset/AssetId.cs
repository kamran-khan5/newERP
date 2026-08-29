public sealed record AssetId
{
  public Guid Value { get; }

  private AssetId(Guid value) => Value = value;

  public static AssetId Of(Guid value)
  {
    if (value == Guid.Empty)
    {
      throw new DomainException("Asset Id cannot be empty");
    }
    return new AssetId(value);
  }
}