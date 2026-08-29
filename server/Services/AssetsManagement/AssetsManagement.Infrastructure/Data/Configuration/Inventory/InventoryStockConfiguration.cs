using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InventoryStockConfiguration : EntityConfiguration<InventoryStock, InventoryStockId>
{
  public override void Configure(EntityTypeBuilder<InventoryStock> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(inventoryStockId => inventoryStockId.Value, dbValue => InventoryStockId.Of(dbValue));

 builder.Property(x => x.ItemId)
    .HasConversion(inventoryItemId => inventoryItemId.Value, dbValue => InventoryItemId.Of(dbValue));

    builder.Property(x => x.WarehouseId)
       .HasConversion(warehouseId => warehouseId.Value, dbValue => WarehouseId.Of(dbValue));



    builder.Property(x => x.AvailableQuantity)
    .HasPrecision(18, 4)
    .IsRequired();
    builder.Property(x => x.ReservedQuantity)
    .HasPrecision(18, 4)
    .IsRequired();

    builder.Ignore(x => x.TotalQuantity);

  }
}