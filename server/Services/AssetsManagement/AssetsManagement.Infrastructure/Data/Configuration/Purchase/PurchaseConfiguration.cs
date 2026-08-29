using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PurchaseConfiguration : EntityConfiguration<Purchase, PurchaseId>
{
  public override void Configure(EntityTypeBuilder<Purchase> builder)
  {
    base.Configure(builder);

    builder.HasKey(x => x.Id);
    builder.Property(x => x.Id)
    .HasConversion(purchaseId => purchaseId.Value, dbValue => PurchaseId.Of(dbValue));

    builder.Property(x => x.SupplierId)
    .HasConversion(supplierId => supplierId.Value, dbValue => PersonId.Of(dbValue));


    builder.Property(x => x.Status)
    .HasDefaultValue(PurchaseStatus.Draft)
    .HasConversion(x => x.ToString(), dbValue => (PurchaseStatus)Enum.Parse(typeof(PurchaseStatus), dbValue))
    .HasMaxLength(30);

    
    builder.HasMany<PurchaseLine>()
    .WithOne()
    .HasForeignKey(f=>f.PurchaseId)
    .IsRequired()
    .OnDelete(DeleteBehavior.Cascade);

        builder.Property(x => x.PurchaseDate)
    .IsRequired();

    builder.Property(x => x.Status)
           .HasDefaultValue(PurchaseStatus.Draft)
           .HasConversion(
               x => x.ToString(),
               dbValue => (PurchaseStatus)Enum.Parse(typeof(PurchaseStatus), dbValue))
           .HasMaxLength(30)
           .IsRequired();
    builder.ComplexProperty(x => x.Currency, currency =>
           {
             currency.Property(c => c.Value)
              .HasMaxLength(3)
              .IsRequired();
           });

    builder.ComplexProperty(x => x.DeliveryAddress, address =>
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

    builder.Property(x => x.ExpectedDeliveryDate)
          .IsRequired(false);



    builder.ComplexProperty(x => x.PaymentTerm, paymentTerm =>
       {
         paymentTerm.Property(p => p.Code)
              .HasMaxLength(50)
              .IsRequired();

         paymentTerm.Property(p => p.DueDays)
              .IsRequired();

         paymentTerm.Property(p => p.AdvancePercentage)
              .HasPrecision(5, 2)
              .IsRequired();
       });



    builder.ComplexProperty(x => x.SubTotal, money =>
        {
          money.Property(m => m.Amount)
              .HasPrecision(18, 2)
              .IsRequired();

          money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

              .HasMaxLength(3)
              .IsRequired();
        });


    builder.ComplexProperty(x => x.TaxAmount, money =>
       {
         money.Property(m => m.Amount)
              .HasPrecision(18, 2)
              .IsRequired();

         money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

              .HasMaxLength(3)
              .IsRequired();
       });


    builder.ComplexProperty(x => x.DiscountAmount, money =>
        {
          money.Property(m => m.Amount)
              .HasPrecision(18, 2)
              .IsRequired();

          money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

              .HasMaxLength(3)
              .IsRequired();
        });


    builder.ComplexProperty(x => x.TotalAmount, money =>
      {
        money.Property(m => m.Amount)
              .HasPrecision(18, 2)
              .IsRequired();

        money.Property(m => m.Currency)
                   .HasConversion(currency => currency.Value, dbValue => Currency.Of(dbValue))

              .HasMaxLength(3)
              .IsRequired();
      });

    builder.Property(x => x.Remarks)
        .IsRequired(false)
        .HasMaxLength(2000);


  }



}