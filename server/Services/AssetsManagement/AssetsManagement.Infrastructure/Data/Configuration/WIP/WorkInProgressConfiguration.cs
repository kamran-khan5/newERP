using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class WorkInProgressConfiguration : EntityConfiguration<WorkInProgress, WorkInProgressId>
{
  public override void Configure(EntityTypeBuilder<WorkInProgress> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(workInProgressId => workInProgressId.Value, dbValue => WorkInProgressId.Of(dbValue));

    builder.Property(x => x.ProductionOrderId)
     .HasConversion(productionOrderId => productionOrderId.Value, dbValue => ProductionOrderId.Of(dbValue));

    builder.Property(x => x.RecordedBy)
     .HasConversion(personId => personId.Value, dbValue => PersonId.Of(dbValue));

    builder.Property(x => x.RecordedAt)
    .IsRequired();

    builder.Property(x => x.Remarks)
    .IsRequired()
    .HasMaxLength(1000);


    builder.Property(x => x.ProgressPercentage)
    .HasPrecision(3, 2)
    .IsRequired();

    builder.Property(x => x.CurrentStage)
    .HasDefaultValue(ProductionStage.NotStarted)
    .HasConversion(x => x.ToString(), dbValue => (ProductionStage)Enum.Parse(typeof(ProductionStage), dbValue))
    .HasMaxLength(30);


  }
}