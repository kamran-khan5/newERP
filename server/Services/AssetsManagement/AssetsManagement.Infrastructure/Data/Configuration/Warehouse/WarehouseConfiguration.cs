using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class WarehouseConfiguration : EntityConfiguration<Warehouse, WarehouseId>
{
    public override void Configure(EntityTypeBuilder<Warehouse> builder)
    {
        base.Configure(builder);

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id)
        .HasConversion(warehouseId => warehouseId.Value, dbValue => WarehouseId.Of(dbValue));


        builder.Property(x => x.Code).HasConversion(code => code.Value, dbValue => Code.Of(dbValue)).IsRequired().HasMaxLength(50);

        builder.Property(x => x.Name)
        .HasConversion(name => name.Value, dbValue => Name.Of(dbValue)).HasMaxLength(100).IsRequired();

        builder.Property(x => x.Description)
        .IsRequired(false).HasMaxLength(1000);



        builder.Property(x => x.WarehouseType)
        .HasDefaultValue(WarehouseType.Main)
        .HasConversion(x => x.ToString(), dbValue => (WarehouseType)Enum.Parse(typeof(WarehouseType), dbValue))
        .HasMaxLength(30);


        builder.Property(x => x.Status)
        .HasDefaultValue(WarehouseStatus.Active)
        .HasConversion(x => x.ToString(), dbValue => (WarehouseStatus)Enum.Parse(typeof(WarehouseStatus), dbValue))
        .HasMaxLength(30);


        builder.Property(x => x.ManagerId)
        .HasConversion(managerId => managerId.Value, dbValue => PersonId.Of(dbValue));

        builder.Property(x => x.ContactNumber)
        .HasConversion(contactNumber => contactNumber.Value, dbValue => ContactNumber.Of(dbValue));

        builder.Property(x => x.Email)
        .HasConversion(email => email.Value, dbValue => Email.Of(dbValue));


        builder.HasMany<InventoryStock>()
        .WithOne()
        .HasForeignKey(f => f.WarehouseId)
        .IsRequired();


        builder.ComplexProperty(x => x.Address, address =>
        {
            address.Property(a => a.Street)
          .IsRequired()
          .HasMaxLength(200);

            address.Property(a => a.Building)
            .IsRequired(false)
            .HasMaxLength(100);

            address.Property(a => a.City)
            .IsRequired()
            .HasMaxLength(100);

            address.Property(a => a.State)
            .IsRequired(false)
            .HasMaxLength(100);

            address.Property(a => a.PostalCode)
            .IsRequired()
            .HasMaxLength(20);

            address.Property(a => a.Country)
            .IsRequired()
            .HasMaxLength(100);

            address.Property(a => a.Longitude)
            .IsRequired(false);

            address.Property(a => a.Latitude)
            .IsRequired(false);
        });

    }
}