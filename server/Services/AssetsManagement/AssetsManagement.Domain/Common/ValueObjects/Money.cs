public sealed record Money
{
  public decimal Amount { get; }

  public Currency Currency { get; }


  private Money(
      decimal amount,
      Currency currency)
  {
    Amount = amount;
    Currency = currency;
  }


  public static Money Of(
      decimal amount,
      Currency currency)
  {
    if (amount < 0)
      throw new DomainException(
          "Amount cannot be negative.");


    ArgumentNullException.ThrowIfNull(currency);


    return new Money(
        amount,
        currency);
  }
}