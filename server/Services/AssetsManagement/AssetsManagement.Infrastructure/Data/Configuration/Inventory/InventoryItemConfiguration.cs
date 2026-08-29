using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class InventoryItemConfiguration : EntityConfiguration<InventoryItem, InventoryItemId>
{
  public override void Configure(EntityTypeBuilder<InventoryItem> builder)
  {

    base.Configure(builder);
    builder.HasKey(x => x.Id);
    
    builder.Property(x => x.Id).HasConversion(
      inventoryItemId => inventoryItemId.Value, dbId => InventoryItemId.Of(dbId)
    );


    builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

    builder.Property(x => x.Name)
    .HasConversion(name => name.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

    builder.Property(x => x.Description)
    .IsRequired(false).HasMaxLength(1000);


    builder.Property(x => x.InventoryTypeId).HasConversion(
      inventoryTypeId => inventoryTypeId.Value, dbId => InventoryTypeId.Of(dbId)
    );
    builder.Property(x => x.FileUrl)
    .HasConversion(file => file.Value, dbValue => FileUrl.Of(dbValue))
    .IsRequired(false);

    builder.HasOne<InventoryType>().WithMany()
    .HasForeignKey(f => f.InventoryTypeId)
    .IsRequired();

    builder.HasMany<InventoryStock>()
    .WithOne()
    .HasForeignKey(f => f.ItemId)
    .IsRequired();


    builder.HasMany<PurchaseLine>()
    .WithOne()
    .HasForeignKey(f=>f.ItemId)
    .IsRequired();

    builder.ComplexProperty(x => x.UnitOfMeasure, uomBuilder =>
    {
      uomBuilder.Property(x => x.Unit).HasMaxLength(10).IsRequired();
      uomBuilder.Property(x => x.Value).IsRequired().HasPrecision(18, 4);
    });

    builder.Property(x => x.InventoryOwnerShipType)
    .HasDefaultValue(InventoryOwnerShipType.Purchase)
    .HasConversion(x => x.ToString(), dbValue => (InventoryOwnerShipType)Enum.Parse(typeof(InventoryOwnerShipType), dbValue))
    .HasMaxLength(30);

    builder.Property(x => x.Status)
    .HasDefaultValue(InventoryItemStatus.Available)
    .HasConversion(x => x.ToString(), dbValue => (InventoryItemStatus)Enum.Parse(typeof(InventoryItemStatus), dbValue))
    .HasMaxLength(30);

  }
}