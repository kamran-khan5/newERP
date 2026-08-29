public sealed record ManufacturerId
{
  public Guid Value;


  private ManufacturerId(Guid value) => Value = value;
  public static ManufacturerId Of(Guid value)
  {

    if (value == Guid.Empty)
    {
      throw new DomainException("Manufacturer Id cannot be empty");
    }
    return new ManufacturerId(value);
  }


}