public class Warehouse : Aggregate<WarehouseId>
{
  public Code Code { get; private set; } = default!;

  public Name Name { get; private set; } = default!;

  public string Description { get; private set; } = default!;

  public Address Address { get; private set; } =default!;

  public WarehouseType WarehouseType { get; private set; } = default!;

  public WarehouseStatus Status { get; private set; } = default!;

  public PersonId ManagerId { get; private set; } = default!;

  public ContactNumber ContactNumber { get; private set; } = default!;

  public Email Email { get; private set; } = default!;

  public static Warehouse Create(
      WarehouseId warehouseId,
      Code code,
      Name name,
      string description,
      Address address,
      WarehouseType warehouseType,
      PersonId managerId,
      ContactNumber contactNumber,
      Email email)
  {
    ArgumentNullException.ThrowIfNull(code);
    ArgumentNullException.ThrowIfNull(name);

    return new Warehouse
    {
      Id = warehouseId,
      Code = code,
      Name = name,
      Description = description,
      Address = address,
      WarehouseType = warehouseType,
      Status = WarehouseStatus.Active,
      ManagerId = managerId,
      ContactNumber = contactNumber,
      Email = email
    };
  }
}