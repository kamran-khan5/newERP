public sealed class PurchaseLine : Entity<PurchaseLineId>
{
  public InventoryItemId ItemId { get; private set; } = default!;
  public PurchaseId PurchaseId { get; private set; } = default!;
  public decimal OrderedQuantity { get; private set; }
  public decimal ReceivedQuantity { get; private set; }
  public UnitOfMeasure UnitOfMeasure { get; private set; } = default!;
  public Money UnitPrice { get; private set; } = default!;

  public decimal DiscountAmount { get; private set; } = default!;

  public decimal TaxAmount { get; private set; } = default!;

  public decimal LineTotal { get; private set; } = default!;

  public string? Remarks { get; private set; }
  public FileUrl? FileUrl { get; set; }


  public static PurchaseLine Create(
    PurchaseLineId purchaseLineId,
    PurchaseId purchaseId,
    InventoryItemId inventoryItemId,
    decimal orderedQuantity,
    decimal receivedQuantity,
    UnitOfMeasure unitOfMeasure,
    Money unitPrice,
    decimal discountAmount,
    decimal taxAmount,
    string? remarks,
    FileUrl? fileUrl
    )
  {
    return new PurchaseLine
    {
      Id = purchaseLineId,
      PurchaseId = purchaseId,
      ItemId = inventoryItemId,
      OrderedQuantity = orderedQuantity,
      ReceivedQuantity = receivedQuantity,
      UnitOfMeasure = unitOfMeasure,
      UnitPrice = unitPrice,
      DiscountAmount = discountAmount,
      TaxAmount = taxAmount,
      LineTotal = CalculateLineTotal(
                orderedQuantity,
                unitPrice,
                discountAmount,
                taxAmount
                ),
      Remarks = remarks,
      FileUrl = fileUrl
    };
  }

  public void Update(
    InventoryItemId inventoryItemId,
    decimal orderedQuantity,
    decimal receivedQuantity,
    UnitOfMeasure unitOfMeasure,
    Money unitPrice,
    decimal discountAmount,
    decimal taxAmount,
    string? remarks,
    FileUrl? fileUrl

    )
  {
    ArgumentNullException.ThrowIfNull(inventoryItemId);
    ArgumentNullException.ThrowIfNull(unitOfMeasure);
    ArgumentNullException.ThrowIfNull(unitPrice);
    ArgumentNullException.ThrowIfNull(discountAmount);
    ArgumentNullException.ThrowIfNull(taxAmount);

    if (orderedQuantity <= 0)
      throw new DomainException(
          "Ordered quantity must be greater than zero.");

    if (receivedQuantity < 0)
      throw new DomainException(
          "Received quantity cannot be negative.");

    if (receivedQuantity > orderedQuantity)
      throw new DomainException(
          "Received quantity cannot exceed ordered quantity.");

    OrderedQuantity = orderedQuantity;
    ReceivedQuantity = receivedQuantity;
    UnitOfMeasure = unitOfMeasure;
    UnitPrice = unitPrice;
    DiscountAmount = discountAmount;
    TaxAmount = taxAmount;
    Remarks = remarks;
    FileUrl = fileUrl;
    LineTotal = CalculateLineTotal(
                orderedQuantity,
                unitPrice,
                discountAmount,
                taxAmount
                );
  }

  private static decimal CalculateLineTotal(
    decimal quantity,
    Money unitPrice,
    decimal discountAmount,
    decimal taxAmount
    )
  {
    decimal amount = (unitPrice.Amount * quantity) - discountAmount + taxAmount;
    return amount;
  }
}