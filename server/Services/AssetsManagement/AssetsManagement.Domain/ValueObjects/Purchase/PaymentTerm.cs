public sealed record PaymentTerm
{
  public string Code { get; }

  public int DueDays { get; }

  public decimal AdvancePercentage { get; }


  private PaymentTerm(
      string code,
      int dueDays,
      decimal advancePercentage)
  {
    Code = code;
    DueDays = dueDays;
    AdvancePercentage = advancePercentage;
  }


  public static PaymentTerm Of(
      string code,
      int dueDays,
      decimal advancePercentage = 0)
  {
    if (string.IsNullOrWhiteSpace(code))
      throw new DomainException(
          "Payment term code is required.");


    if (dueDays < 0)
      throw new DomainException(
          "Due days cannot be negative.");


    if (advancePercentage < 0 ||
        advancePercentage > 100)
      throw new DomainException(
          "Advance percentage must be between 0 and 100.");


    return new PaymentTerm(
        code.Trim()
            .ToUpperInvariant(),
        dueDays,
        advancePercentage);
  }
}