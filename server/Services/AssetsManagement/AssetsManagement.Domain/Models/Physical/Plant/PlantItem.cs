public class PlantItem : Entity<PlantItemId>
{
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public string Description { get; private set; } = default!;
  public ManufacturerId ManufacturerId { get; private set; } = default!;
  public string Model { get; private set; } = default!;
  public string SerialNumber { get; private set; } = default!;
  public DateTime InstallationDateTime { get; private set; } = default!;
  public decimal UsefulLifeYears { get; private set; } = default!;
  public Unit Unit { get; private set; } = default!;
  public decimal Capacity { get; private set; } = default!;
  public DateTime WarrantyExpirationDate { get; private set; } = default!;
  public PersonId SupplierId { get; private set; } = default!;

  private PlantItem() { }
  public static PlantItem Create(
          Guid plantItemId,
          Code code,
          Name name,
          string description,
          ManufacturerId manufacturerId,
          string model,
          string serialNumber,
          DateTime installationDateTime,
          decimal usefulLifeYears,
          Unit unit,
          decimal capacity,
          DateTime warrantyExpirationDate,
          PersonId supplierId)
  {
    return new PlantItem
    {
      Id = PlantItemId.Of(plantItemId),
      Code = code,
      Name = name,
      Description = description,
      ManufacturerId = manufacturerId,
      Model = model,
      SerialNumber = serialNumber,
      InstallationDateTime = installationDateTime,
      UsefulLifeYears = usefulLifeYears,
      Unit = unit,
      Capacity = capacity,
      WarrantyExpirationDate = warrantyExpirationDate,
      SupplierId = supplierId
    };
  }


  public void Update(
        Code code,
        Name name,
        string description,
        ManufacturerId manufacturerId,
        string model,
        string serialNumber,
        DateTime installationDateTime,
        decimal usefulLifeYears,
        Unit unit,
        decimal capacity,
        DateTime warrantyExpirationDate,
        PersonId supplierId)
  {
    Code = code;
    Name = name;
    Description = description;
    ManufacturerId = manufacturerId;
    Model = model;
    SerialNumber = serialNumber;
    InstallationDateTime = installationDateTime;
    UsefulLifeYears = usefulLifeYears;
    Unit = unit;
    Capacity = capacity;
    WarrantyExpirationDate = warrantyExpirationDate;
    SupplierId = supplierId;
  }

}