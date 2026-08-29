using FluentValidation;

public record CreateInventoryItemResult(Guid Id);
public record CreateInventoryItemCommand(InventoryItemDto InventoryItem) : ICommand<Result<CreateInventoryItemResult>>;

public class InventoryItemDtoValidator : AbstractValidator<InventoryItemDto>
{
  public InventoryItemDtoValidator()
  {
    RuleFor(x => x.Code).Code();
    RuleFor(x => x.Name).Name();
    RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters.");
    RuleFor(x => x.InventoryTypeId).NotEmpty()
            .WithMessage("Inventory Type is Required");
    RuleFor(x => x.UnitOfMeasure).SetValidator(new UnitOfMeasureDtoValidator());
    RuleFor(x => x.InventoryOwnerShipType)
     .IsInEnum()
     .WithMessage("Invalid inventory item type.");

    RuleFor(x => x.InventoryItemStatus)
     .IsInEnum()
     .WithMessage("Invalid inventory item status.");
  }
}

public class UnitOfMeasureDtoValidator : AbstractValidator<UnitOfMeasureDto>
{
  private const int MaxLength = 10;
  private const int MinLength = 1;

  public UnitOfMeasureDtoValidator()
  {
    RuleFor(x => x.Unit)
            .NotEmpty()
            .WithMessage("Unit is required.")
            .MinimumLength(MinLength)
            .WithMessage($"Unit must be at least {MinLength} character.")
            .MaximumLength(MaxLength)
            .WithMessage($"Unit must not exceed {MaxLength} characters.")
            .Matches(@"^[A-Za-z0-9_-]+$")
            .WithMessage("Unit can only contain letters, numbers, '-' and '_'.")
            .Must(x => x == x.Trim())
            .WithMessage("Unit must not contain leading or trailing whitespace.");

    RuleFor(x => x.Value)
        .GreaterThan(0)
        .WithMessage("Value must be greater than zero.");
  }
}