using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PhysicalConfiguration : EntityConfiguration<Physical, PhysicalId>
{
  public override void Configure(EntityTypeBuilder<Physical> builder)
  {
    base.Configure(builder);
    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id).HasConversion(
      physical => physical.Value, dbId => PhysicalId.Of(dbId)
    );

    builder.HasOne<Asset>()
    .WithOne()
    .HasForeignKey<Physical>(x => x.AssetId)
    .OnDelete(DeleteBehavior.Cascade);

  }
}