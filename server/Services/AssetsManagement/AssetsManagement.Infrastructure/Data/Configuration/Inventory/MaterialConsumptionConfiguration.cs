using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class MaterialConsumptionConfiguration : EntityConfiguration<MaterialConsumption, AssetId>
{
  public override void Configure(EntityTypeBuilder<MaterialConsumption> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(materialConsumptionId => materialConsumptionId.Value, dbValue => AssetId.Of(dbValue));


    builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

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
  }
}