using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ERP.Domain.Entities.Asset;

namespace ERP.Infrastructure.Data.Configurations;

public class CategoryAttributeOptionConfiguration : IEntityTypeConfiguration<CategoryAttributeOption>
{
    public void Configure(EntityTypeBuilder<CategoryAttributeOption> builder)
    {
        builder.ToTable("CategoryAttributeOptions");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.AttributeId)
            .IsRequired();

        builder.Property(e => e.Value)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(e => e.Label)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.HasOne(e => e.Attribute)
            .WithMany(a => a.Options)
            .HasForeignKey(e => e.AttributeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(e => new { e.AttributeId, e.Value })
            .IsUnique();

        builder.HasIndex(e => e.AttributeId);
    }
}
