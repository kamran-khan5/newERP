public sealed record Currency
{
  public string Value { get; }

  private Currency(string value)
  {
    Value = value;
  }


  public static Currency Of(string value)
  {
    if (string.IsNullOrWhiteSpace(value))
      throw new DomainException(
          "Currency Value cannot be empty.");


    value = value.Trim()
               .ToUpperInvariant();


    if (value.Length != 3)
      throw new DomainException(
          "Currency Value must be 3 characters.");


    return new Currency(value);
  }
}