public class InventoryItem : Aggregate<InventoryItemId>
{
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public string? Description { get; private set; }
  public FileUrl? FileUrl { get; set; }

  public InventoryTypeId InventoryTypeId { get; private set; } = default!;
  public UnitOfMeasure UnitOfMeasure { get; private set; } = default!;
  public InventoryOwnerShipType InventoryOwnerShipType { get; private set; } = default!;
  public InventoryItemStatus Status { get; private set; } = default!;


  public static InventoryItem Create(InventoryItemId inventoryItemId, Name name,Code code ,string description,  InventoryTypeId inventoryTypeId, UnitOfMeasure unitOfMeasure, InventoryOwnerShipType inventoryOwnerShipType, InventoryItemStatus inventoryItemStatus, FileUrl? fileUrl)
  {
    return new InventoryItem
    {
      Id = inventoryItemId,
      Name = name,
      Code=code,
      Description = description,
      InventoryTypeId = inventoryTypeId,
      UnitOfMeasure = unitOfMeasure,
      InventoryOwnerShipType = inventoryOwnerShipType,
      Status = inventoryItemStatus,
      FileUrl = fileUrl
    };
  }

  public void Update(Name name, string description, InventoryTypeId inventoryTypeId, UnitOfMeasure unitOfMeasure, InventoryOwnerShipType inventoryOwnerShipType, InventoryItemStatus inventoryItemStatus,

FileUrl? fileUrl
  )
  {
    Name = name;
    Description = description;
    InventoryTypeId = inventoryTypeId;
    UnitOfMeasure = unitOfMeasure;
    InventoryOwnerShipType = inventoryOwnerShipType;
    Status = inventoryItemStatus;
    FileUrl = fileUrl;
  }

  public void ChangeStatus(InventoryItemStatus status)
  {
    Status = status;
  }

}