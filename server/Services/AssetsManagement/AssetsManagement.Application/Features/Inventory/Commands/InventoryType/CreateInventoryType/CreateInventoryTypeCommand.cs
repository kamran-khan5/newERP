using FluentValidation;

public sealed record CreateInventoryTypeResult(Guid Id);
public sealed record CreateInventoryTypeCommand(InventoryTypeDto InventoryType) : ICommand<Result<CreateInventoryTypeResult>>;

public class CreateInventoryTypeCommandValidator : AbstractValidator<CreateInventoryTypeCommand>
{

}

public class InventoryTypeDtoValidator : AbstractValidator<InventoryTypeDto>
{
  public InventoryTypeDtoValidator()
  {
    RuleFor(x => x.Code).Code();
    RuleFor(x => x.Name).Name();
    RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters.");
    RuleFor(x => x.InventoryCategoryId).NotEmpty().WithMessage("Inventory Id is required");
  }
}
