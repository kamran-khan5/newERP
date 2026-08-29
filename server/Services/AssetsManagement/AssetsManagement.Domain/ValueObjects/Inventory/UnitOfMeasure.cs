using System.Text.RegularExpressions;

public sealed record UnitOfMeasure
{
  private const int MaxLength = 10;

  private const int MinLength = 1;

  private static readonly Regex UnitRegex =
      new(@"^[A-Za-z0-9_-]+$", RegexOptions.Compiled);

  public string Unit { get; }
  public decimal Value { get; }

  private UnitOfMeasure(string unit, decimal value)
  {
    Unit = unit;
    Value = value;
  }

  public static UnitOfMeasure Of(string unit, decimal value)
  {
    if (string.IsNullOrWhiteSpace(unit))
      throw new DomainException("Unit cannot be empty.");

    unit = unit.Trim().ToUpperInvariant();

    if (unit.Length < MinLength || unit.Length > MaxLength)
      throw new DomainException(
          $"Unit must be between {MinLength} and {MaxLength} characters.");

    if (!UnitRegex.IsMatch(unit))
      throw new DomainException(
          "Unit can only contain letters, numbers, '-' and '_'.");

    if (value <= 0)
      throw new ArgumentOutOfRangeException(
          nameof(value), "Value must be greater than zero.");

    return new UnitOfMeasure(unit, value);
  }

}