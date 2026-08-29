public sealed record PhysicalId
{
  public Guid Value;


  private PhysicalId(Guid value) => Value = value;
  public static PhysicalId Of(Guid value)
  {

    if (value == Guid.Empty)
    {
      throw new DomainException("Physical Id cannot be empty");
    }
    return new PhysicalId(value);
  }


}