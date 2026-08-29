using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InventoryTypeConfiguration
    : EntityConfiguration<InventoryType, InventoryTypeId>
{
  public override void Configure(
      EntityTypeBuilder<InventoryType> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id)
.HasConversion(inventoryTypeId => inventoryTypeId.Value, dbValue => InventoryTypeId.Of(dbValue));

    builder.Property(x => x.Code)
        .HasConversion(
            code => code.Value,
            dbValue => Code.Of(dbValue))
        .IsRequired()
        .HasMaxLength(50);

    builder.Property(x => x.Name)
        .HasConversion(
            name => name.Value,
            dbValue => Name.Of(dbValue))
        .HasMaxLength(100)
        .IsRequired();

    builder.Property(x => x.Description)
        .IsRequired(false)
        .HasMaxLength(1000);

    builder.Property(x => x.InventoryCategoryId)
        .HasConversion(
            inventoryCategoryId => inventoryCategoryId.Value,
            dbValue => InventoryCategoryId.Of(dbValue));
  }
}