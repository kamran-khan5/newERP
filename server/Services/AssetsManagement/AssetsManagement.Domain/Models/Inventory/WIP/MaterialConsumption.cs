public sealed class MaterialConsumption : Entity<AssetId>
{
  public const int DescriptionMaxLength = 1000;
  public Code Code { get; private set; } = default!;
  public string Description { get; private set; } = default!;
  public InventoryItemId InventoryItemId { get; private set; } = default!;
  public decimal Quantity { get; private set; } = default!;
  public ProductionOrderId ProductionOrderId { get; private set; } = default!;
  public Money UnitCost { get; private set; } = default!;
  public Money TotalCost { get; private set; } = default!;

  public static MaterialConsumption Create(
          AssetId id,
          Code code,
          string description,
          InventoryItemId inventoryItemId,
          decimal quantity,
          ProductionOrderId productionOrderId,
          Money unitCost)
  {
    if (quantity <= 0)
      throw new DomainException("Quantity must be greater than zero.");

    if (string.IsNullOrWhiteSpace(description))
      throw new DomainException("Description is required.");

    if (description.Length > DescriptionMaxLength)
      throw new DomainException($"Description cannot exceed {DescriptionMaxLength} characters.");

    var totalCost = Money.Of(
        unitCost.Amount * quantity,
        unitCost.Currency);

    return new MaterialConsumption
    {
      Id = id,
      Code = code,
      Description = description,
      InventoryItemId = inventoryItemId,
      Quantity = quantity,
      ProductionOrderId = productionOrderId,
      UnitCost = unitCost,
      TotalCost = totalCost,
    };
  }
}