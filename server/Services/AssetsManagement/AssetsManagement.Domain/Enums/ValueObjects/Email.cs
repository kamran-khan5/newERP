using System.Net.Mail;

public sealed record Email
{
  public string Value { get; }
  private const int MaximumLength= 255;
  private Email(string value)
  {
    Value = value;
  }


  public static Email Of(string value)
  {
    if (string.IsNullOrWhiteSpace(value))
      throw new DomainException(
          "Email cannot be empty.");


    value = value.Trim()
                 .ToLowerInvariant();


    if (value.Length > MaximumLength)
      throw new DomainException(
          "Email cannot exceed 255 characters.");


    try
    {
      var mailAddress = new MailAddress(value);

      if (mailAddress.Address != value)
        throw new DomainException(
            "Invalid email format.");
    }
    catch
    {
      throw new DomainException(
          "Invalid email address.");
    }


    return new Email(value);
  }
}