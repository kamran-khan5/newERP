using System.Text.RegularExpressions;

public sealed record ContactNumber
{
  private const int MinimumLength = 10;
  private const int MaximumLength = 15;

  public string Value { get; }

  private ContactNumber(string value)
  {
    Value = value;
  }


  public static ContactNumber Of(string value)
  {
    if (string.IsNullOrWhiteSpace(value))
      throw new DomainException("Contact number cannot be empty.");


    value = Regex.Replace(value, @"[\s\-\(\)]", "");


    if (!value.StartsWith("+"))
      throw new DomainException(
          "Contact number must include country code (+92).");


    if (!Regex.IsMatch(value, @"^\+[0-9]+$"))
      throw new DomainException(
          "Contact number contains invalid characters.");

    var digits = value.Substring(1);

    if (digits.Length < MinimumLength || digits.Length > MaximumLength)
      throw new DomainException(
          "Contact number length must be between 10 and 15 digits.");


    return new ContactNumber(value);
  }
}