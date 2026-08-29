public sealed record Unit
{
  private const int DefaultLength = 100;
  public string Value { get; }
  private Unit(string value) => Value = value;
  public static Unit Of(string value)
  {
    ArgumentException.ThrowIfNullOrWhiteSpace(value);
    ArgumentOutOfRangeException.ThrowIfGreaterThan(value.Length, DefaultLength);

    return new Unit(value);
  }
}