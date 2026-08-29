using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class AssetConfiguration : EntityConfiguration<Asset, AssetId>
{
  public override void Configure(EntityTypeBuilder<Asset> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);

    builder.Property(x => x.Id).HasConversion(
      assetId => assetId.Value, dbId => AssetId.Of(dbId)
    );


    builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

    builder.Property(x => x.Name)
    .HasConversion(name => name.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

    builder.Property(x => x.Description)
    .IsRequired(false).HasMaxLength(1000);

  }
}