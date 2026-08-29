using FluentValidation;

public sealed record UpdateInventoryTypeResult(bool IsSuccess);
public record UpdateInventoryTypeCommand(Guid Id, InventoryTypeDto InventoryType) : ICommand<Result<UpdateInventoryTypeResult>>;

public class UpdateInventoryTypeCommandValidator : AbstractValidator<UpdateInventoryTypeCommand>
{
  public UpdateInventoryTypeCommandValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("");
    RuleFor(x => x.InventoryType).SetValidator(new InventoryTypeDtoValidator());
  }
}