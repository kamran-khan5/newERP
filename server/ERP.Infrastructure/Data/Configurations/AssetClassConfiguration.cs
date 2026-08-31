using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ERP.Domain.Entities.Asset;

namespace ERP.Infrastructure.Data.Configurations;

public class AssetClassConfiguration : IEntityTypeConfiguration<AssetClass>
{
    private static readonly DateTime SeedDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public void Configure(EntityTypeBuilder<AssetClass> builder)
    {
        builder.ToTable("AssetClasses");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Code)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(e => e.Description)
            .HasMaxLength(500);

        builder.HasData(
            new AssetClass
            {
                Id = 1,
                Code = "PHY",
                Name = "Physical Assets",
                Description = "Tangible property including land, buildings, vehicles, machinery, and office equipment.",
                IsActive = true,
                CreatedAtUtc = SeedDate
            },
            new AssetClass
            {
                Id = 2,
                Code = "FIN",
                Name = "Financial Assets",
                Description = "Monetary resources including bank deposits, investments, securities, and receivables.",
                IsActive = true,
                CreatedAtUtc = SeedDate
            },
            new AssetClass
            {
                Id = 3,
                Code = "INT",
                Name = "Intangible Assets",
                Description = "Non-physical property including software licenses, patents, trademarks, and digital rights.",
                IsActive = true,
                CreatedAtUtc = SeedDate
            },
            new AssetClass
            {
                Id = 4,
                Code = "INV",
                Name = "Inventory & Supplies",
                Description = "Operational stock, spare parts, raw materials, and consumables held for use or distribution.",
                IsActive = true,
                CreatedAtUtc = SeedDate
            }
        );
    }
}
