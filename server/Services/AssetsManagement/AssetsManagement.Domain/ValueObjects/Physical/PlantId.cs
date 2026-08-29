public sealed record PlantId
{
  public Guid Value;


  private PlantId(Guid value) => Value = value;
  public static PlantId Of(Guid value)
  {

    if (value == Guid.Empty)
    {
      throw new DomainException("Plant Id cannot be empty");
    }
    return new PlantId(value);
  }


}