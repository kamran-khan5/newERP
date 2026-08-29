using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InventoryCategoryConfiguration : EntityConfiguration<InventoryCategory, InventoryCategoryId>
{
  public override void Configure(EntityTypeBuilder<InventoryCategory> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(inventoryCategoryId => inventoryCategoryId.Value, dbValue => InventoryCategoryId.Of(dbValue));


    // builder.Property(x => x.InventoryTypeId)
    // .HasConversion(inventoryTypeId => inventoryTypeId.Value, dbValue => InventoryTypeId.Of(dbValue));



    builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

    builder.Property(x => x.Name)
    .HasConversion(name => name.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

    builder.Property(x => x.Description)
    .IsRequired(false).HasMaxLength(1000);

    builder.Property(x => x.IsActive)
    .HasDefaultValue(true);

    builder.HasMany<InventoryType>().WithOne()
    .HasForeignKey(f => f.InventoryCategoryId)
    .IsRequired();

  }
}