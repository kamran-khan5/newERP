using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FinishedGoodItemConfiguration : EntityConfiguration<FinishedGoodItem, FinishedGoodItemId>
{
  public override void Configure(EntityTypeBuilder<FinishedGoodItem> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(finishedGoodItemId => finishedGoodItemId.Value, dbValue => FinishedGoodItemId.Of(dbValue));

        builder.Property(x => x.Code)
        .HasConversion(code => code.Value,
         dbValue => Code.Of(dbValue))
         .IsRequired()
         .HasMaxLength(50);
     

    builder.Property(x => x.Name)
    .HasConversion(productionOrderName => productionOrderName.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

    builder.Property(x => x.Description)
    .IsRequired(false).HasMaxLength(1000);

        builder.Property(x => x.InventoryItemId)
        .HasConversion(inventoryItemId => inventoryItemId.Value, dbValue => InventoryItemId.Of(dbValue));

        builder.Property(x => x.ProductionOrderId)
        .HasConversion(productionOrderId => productionOrderId.Value, dbValue => ProductionOrderId.Of(dbValue));

        builder.Property(x => x.Quantity)
.HasPrecision(18, 4)
.IsRequired();
    builder.ComplexProperty(x => x.UnitCost, money =>
            {
              money.Property(m => m.Amount)
                  .HasPrecision(18, 2)
                  .IsRequired();

              money.Property(m => m.Currency)
                   .HasConversion(currency=>currency.Value,dbValue=>Currency.Of(dbValue))
                  .HasMaxLength(3)
                  .IsRequired();
            });
    builder.ComplexProperty(x => x.TotalCost, money =>
    {
      money.Property(m => m.Amount)
          .HasPrecision(18, 2)
          .IsRequired();

      money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

          .HasMaxLength(3)
          .IsRequired();
    });

    builder.ComplexProperty(x => x.TotalCost, money =>
{
  money.Property(m => m.Amount)
      .HasPrecision(18, 2)
      .IsRequired();

  money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

      .HasMaxLength(3)
      .IsRequired();
});

    builder.Property(x => x.WarehouseId)
   .HasConversion(warehouseId => warehouseId.Value, dbValue => WarehouseId.Of(dbValue));

    builder.Property(x => x.ReceiptDate)
.IsRequired();

  }
}