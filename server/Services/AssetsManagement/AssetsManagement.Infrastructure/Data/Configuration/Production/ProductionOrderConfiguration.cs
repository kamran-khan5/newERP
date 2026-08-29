using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ProductionOrderConfiguration : EntityConfiguration<ProductionOrder, ProductionOrderId>
{
  public override void Configure(EntityTypeBuilder<ProductionOrder> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(productionOrderId => productionOrderId.Value, dbValue => ProductionOrderId.Of(dbValue));


    builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

    builder.Property(x => x.ProductionOrderName)
    .HasConversion(productionOrderName => productionOrderName.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

    builder.Property(x => x.Description)
    .IsRequired(false).HasMaxLength(1000);

    builder.HasMany<FinishedGoodItem>()
    .WithOne()
    .HasForeignKey(f => f.ProductionOrderId)
    .IsRequired(true);

    builder.HasMany<MaterialConsumption>()
    .WithOne()
    .HasForeignKey(f => f.ProductionOrderId)
    .IsRequired(true);

    builder.HasMany<WorkInProgress>()
    .WithOne()
    .HasForeignKey(f => f.ProductionOrderId)
    .IsRequired(true);

    builder.Property(x => x.PlannedStartDate)
    .IsRequired();
    builder.Property(x => x.PlannedEndDate)
   .IsRequired();
    builder.Property(x => x.ActualStartDate)
    .IsRequired();
    builder.Property(x => x.ActualEndDate)
   .IsRequired();

    builder.Property(x => x.WarehouseId)
   .HasConversion(warehouseId => warehouseId.Value, dbValue => WarehouseId.Of(dbValue));

    builder.Property(x => x.SuperVisorId)
    .HasConversion(superVisorId => superVisorId.Value, dbValue => PersonId.Of(dbValue));

    builder.Property(x => x.Notes)
    .IsRequired(false).HasMaxLength(1000);

    builder.Property(x => x.IsApproved)
    .HasDefaultValue(false);

    builder.Property(x => x.ApprovedAt)
   .IsRequired();
  }

}