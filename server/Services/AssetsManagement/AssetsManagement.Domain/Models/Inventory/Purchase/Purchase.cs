
public class Purchase : Aggregate<PurchaseId>
{
  private readonly List<PurchaseLine> _lines = new();

  public IReadOnlyCollection<PurchaseLine> Lines => _lines;

  public PersonId SupplierId { get; private set; } = default!;

  public DateTime PurchaseDate { get; private set; }

  public PurchaseStatus Status { get; private set; } = default!;

  public Currency Currency { get; private set; } = default!;

  public Address DeliveryAddress { get; private set; } = default!;

  public DateTime? ExpectedDeliveryDate { get; private set; }

  public PaymentTerm PaymentTerm { get; private set; } = default!;

  public Money SubTotal { get; private set; } = default!;

  public Money TaxAmount { get; private set; } = default!;

  public Money DiscountAmount { get; private set; } = default!;

  public Money TotalAmount { get; private set; } = default!;

  public string? Remarks { get; private set; }


  public static Purchase Create(
    PurchaseId purchaseId,
    PersonId supplierId,
    DateTime purchaseDate,
    PurchaseStatus purchaseStatus,
    Currency currency,
    Address deliveryAddress,
    DateTime? expectedDeliveryDate,
    PaymentTerm paymentTerm,
    string? remarks)
  {
    ArgumentNullException.ThrowIfNull(supplierId);
    ArgumentNullException.ThrowIfNull(currency);
    ArgumentNullException.ThrowIfNull(deliveryAddress);
    ArgumentNullException.ThrowIfNull(paymentTerm);

    var purchase = new Purchase
    {
      Id = purchaseId,
      SupplierId = supplierId,
      PurchaseDate = purchaseDate,
      Status = purchaseStatus,
      Currency = currency,
      DeliveryAddress = deliveryAddress,
      ExpectedDeliveryDate = expectedDeliveryDate,
      PaymentTerm = paymentTerm,
      Remarks = remarks,

      SubTotal = Money.Of(0, currency),
      TaxAmount = Money.Of(0, currency),
      DiscountAmount = Money.Of(0, currency),
      TotalAmount = Money.Of(0, currency)
    };
    purchase.AddDomainEvent(purchase);

    return purchase;
  }


  public void Update(
      PersonId supplierId,
      DateTime purchaseDate,
      Currency currency,
      Address deliveryAddress,
      DateTime? expectedDeliveryDate,
      PaymentTerm paymentTerm,
      PurchaseStatus status,
      string? remarks)
  {
    ArgumentNullException.ThrowIfNull(supplierId);
    ArgumentNullException.ThrowIfNull(currency);
    ArgumentNullException.ThrowIfNull(deliveryAddress);
    ArgumentNullException.ThrowIfNull(paymentTerm);

    SupplierId = supplierId;
    PurchaseDate = purchaseDate;
    Status = status;
    Currency = currency;
    DeliveryAddress = deliveryAddress;
    ExpectedDeliveryDate = expectedDeliveryDate;
    PaymentTerm = paymentTerm;
    Remarks = remarks;

    RecalculateTotals();

    AddDomainEvent(new PurchaseEventUpdated(this));
  }
  public void AddPurchaseLine(IList<PurchaseLine> purchaseLine)
  {
    _lines.AddRange(purchaseLine);
    RecalculateTotals();
    AddDomainEvent(new AddToPurchaseLineEvent(purchaseLine));
  }

  public void RemovePurchaseLine(PurchaseLineId purchaseLineId)
  {
    var purchaseLine = _lines.FirstOrDefault(p => p.Id == purchaseLineId);
    if (purchaseLine is not null)
      _lines.Remove(purchaseLine);
    RecalculateTotals();

  }

  private void RecalculateTotals()
  {
    var subTotal = _lines.Sum(x => x.UnitPrice.Amount * x.OrderedQuantity);
    var tax = _lines.Sum(x => x.TaxAmount);
    var discount = _lines.Sum(x => x.DiscountAmount);

    SubTotal = Money.Of(subTotal, Currency);
    TaxAmount = Money.Of(tax, Currency);
    DiscountAmount = Money.Of(discount, Currency);
    TotalAmount = Money.Of(subTotal + tax - discount, Currency);
  }

  public void Approve()
  {
    Status = PurchaseStatus.Approved;
    AddDomainEvent(new PurchaseApprovedEvent());
  }

}