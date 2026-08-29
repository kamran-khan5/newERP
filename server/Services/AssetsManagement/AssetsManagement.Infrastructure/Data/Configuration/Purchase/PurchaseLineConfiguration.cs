using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PurchaseLineConfiguration : EntityConfiguration<PurchaseLine, PurchaseLineId>
{
  public override void Configure(EntityTypeBuilder<PurchaseLine> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)

    .HasConversion(purchaseLineId => purchaseLineId.Value, dbValue => PurchaseLineId.Of(dbValue));

    builder.Property(x => x.OrderedQuantity)
    .HasPrecision(18, 4)
    .IsRequired();
    builder.Property(x => x.ReceivedQuantity)
    .HasPrecision(18, 4)
    .IsRequired();

    builder.Property(x => x.ItemId)
    .HasConversion(inventoryItemId => inventoryItemId.Value, dbValue => InventoryItemId.Of(dbValue));

    builder.Property(x => x.PurchaseId)
    .HasConversion(purchaseId => purchaseId.Value, dbValue => PurchaseId.Of(dbValue));

    builder.Property(x => x.FileUrl)
    .HasConversion(file => file.Value, dbValue => FileUrl.Of(dbValue))
    .IsRequired(false);
    builder.ComplexProperty(x => x.UnitPrice, money =>
{
  money.Property(m => m.Amount)
       .HasPrecision(18, 2)
       .IsRequired();

  money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

       .HasMaxLength(3)
       .IsRequired();
});
    builder.Property(x => x.DiscountAmount
    ).HasPrecision(18, 2)
       .IsRequired();

    builder.Property(x => x.TaxAmount
    ).HasPrecision(18, 2)
       .IsRequired();


    builder.ComplexProperty(x => x.UnitOfMeasure, uomBuilder =>
    {
      uomBuilder.Property(x => x.Unit).HasMaxLength(10).IsRequired();
      uomBuilder.Property(x => x.Value).IsRequired().HasPrecision(18, 4);
    });
    builder.Property(x => x.LineTotal
    ).IsRequired();

    builder.Property(x => x.Remarks)
        .IsRequired(false)
        .HasMaxLength(2000);
  }
}