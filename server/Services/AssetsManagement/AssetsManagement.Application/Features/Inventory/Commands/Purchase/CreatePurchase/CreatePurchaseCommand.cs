using FluentValidation;

public record CreatePurchaseCommandResult(Guid Id);
public sealed record CreatePurchaseCommand(PurchaseDto Purchase) : ICommand<Result<CreatePurchaseCommandResult>>;

public class PurchaseDtoValidator : AbstractValidator<PurchaseDto>
{
    public PurchaseDtoValidator()
    {
        RuleFor(x => x.SupplierId)
            .NotEmpty()
            .WithMessage("Supplier is required.");

        RuleFor(x => x.PurchaseDate)
            .NotEmpty()
            .WithMessage("Purchase date is required.");

        RuleFor(x => x.Status)
            .IsInEnum()
            .WithMessage("Invalid purchase status.");

        RuleFor(x => x.Currency)
            .IsInEnum()
            .WithMessage("Invalid currency.");

        RuleFor(x => x.DeliveryAddress)
            .NotNull()
            .WithMessage("Delivery address is required.");

        RuleFor(x => x.ExpectedDeliveryDate)
            .GreaterThanOrEqualTo(x => x.PurchaseDate)
            .When(x => x.ExpectedDeliveryDate.HasValue)
            .WithMessage("Expected delivery date cannot be before purchase date.");

        RuleFor(x => x.PaymentTerm)
            .IsInEnum()
            .WithMessage("Invalid payment term.");

        RuleFor(x => x.Lines)
            .NotNull()
            .WithMessage("Purchase lines are required.")
            .WithMessage("Purchase must contain at least one line.")
            .ForEach(x => x.SetValidator(new PurchaseLineDtoValidator()));
    }
}

public sealed class PurchaseLineDtoValidator
    : AbstractValidator<PurchaseLineDto>
{
    public PurchaseLineDtoValidator()
    {
        RuleFor(x => x.ItemId)
            .NotEmpty()
            .WithMessage("Item is required.");

        RuleFor(x => x.PurchaseId)
            .NotEmpty()
            .WithMessage("Purchase Id is required.");

        RuleFor(x => x.OrderedQuantity)
            .GreaterThan(0)
            .WithMessage("Ordered quantity must be greater than zero.");

        RuleFor(x => x.ReceivedQuantity)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Received quantity cannot be negative.");

        RuleFor(x => x.ReceivedQuantity)
            .LessThanOrEqualTo(x => x.OrderedQuantity)
            .WithMessage("Received quantity cannot exceed ordered quantity.");

        RuleFor(x => x.UnitOfMeasure)
            .NotNull()
            .WithMessage("Unit of measure is required.");

        RuleFor(x => x.UnitPrice)
            .NotNull()
            .WithMessage("Unit price is required.");

        RuleFor(x => x.UnitPrice.Amount)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Unit price cannot be negative.");

        RuleFor(x => x.DiscountAmount)
            .NotNull()
            .WithMessage("Discount amount is required.");

        RuleFor(x => x.DiscountAmount)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Discount amount cannot be negative.");

        RuleFor(x => x.TaxAmount)
            .NotNull()
            .WithMessage("Tax amount is required.");

        RuleFor(x => x.TaxAmount)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Tax amount cannot be negative.");
    }
}