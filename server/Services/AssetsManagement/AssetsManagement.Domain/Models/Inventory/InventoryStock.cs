public sealed class InventoryStock : Aggregate<InventoryStockId>
{
  public InventoryItemId ItemId { get; private set; } = default!;
  public WarehouseId WarehouseId { get; private set; } = default!;
  public decimal AvailableQuantity { get; private set; }
  public decimal ReservedQuantity { get; private set; }

  public decimal TotalQuantity => AvailableQuantity + ReservedQuantity;

  public void AddToAvailableQuantity(decimal quantity)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be positive");

    AvailableQuantity += quantity;
  }

  public void AddToReservedQuantity(decimal quantity)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be positive");

    if (quantity > AvailableQuantity)
      throw new InvalidOperationException(
          $"Insufficient available stock. Available: {AvailableQuantity}, Requested to reserve: {quantity}");

    ReservedQuantity += quantity;
    AvailableQuantity -= quantity;
  }

  public void ReleaseReservedQuantity(decimal quantity)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be positive");

    if (quantity > ReservedQuantity)
      throw new InvalidOperationException(
          $"Insufficient reserved stock. Reserved: {ReservedQuantity}, Requested to release: {quantity}");

    ReservedQuantity -= quantity;
    AvailableQuantity += quantity;
  }

  public void IssueStock(decimal quantity)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be positive");

    if (quantity > ReservedQuantity)
      throw new DomainException(
          $"Insufficient reserved stock. Reserved: {ReservedQuantity}, Requested to issue: {quantity}");

    ReservedQuantity -= quantity;
  }
}