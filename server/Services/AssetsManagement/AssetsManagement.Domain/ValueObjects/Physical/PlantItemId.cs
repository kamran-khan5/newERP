public sealed record PlantItemId
{
  public Guid Value;


  private PlantItemId(Guid value) => Value = value;
  public static PlantItemId Of(Guid value)
  {

    if (value == Guid.Empty)
    {
      throw new DomainException("PlantItem Id cannot be empty");
    }
    return new PlantItemId(value);
  }


}