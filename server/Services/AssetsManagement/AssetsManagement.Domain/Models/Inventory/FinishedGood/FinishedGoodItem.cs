public sealed class FinishedGoodItem : Entity<FinishedGoodItemId>
{
  public Code Code { get; private set; } = default!;
  public Name Name { get; private set; } = default!;
  public string Description { get; private set; } = default!;
  public ProductionOrderId ProductionOrderId { get; private set; } = default!;

  public InventoryItemId InventoryItemId { get; private set; } = default!;

  public decimal Quantity { get; private set; }

  public Money UnitCost { get; private set; } = default!;

  public Money TotalCost { get; private set; } = default!;

  public WarehouseId WarehouseId { get; private set; } = default!;

  public DateTime ReceiptDate { get; private set; }
  public static FinishedGoodItem Create(
       FinishedGoodItemId id,
       ProductionOrderId productionOrderId,
       InventoryItemId inventoryItemId,
       decimal quantity,
       Money unitCost,
       WarehouseId warehouseId,
       DateTime receiptDate)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be greater than zero.");

    var totalCost = Money.Of(
        unitCost.Amount * quantity,
        unitCost.Currency);

    return new FinishedGoodItem
    {
      Id = id,
      ProductionOrderId = productionOrderId,
      InventoryItemId = inventoryItemId,
      Quantity = quantity,
      UnitCost = unitCost,
      TotalCost = totalCost,
      WarehouseId = warehouseId,
      ReceiptDate = receiptDate,
    };
  }
}