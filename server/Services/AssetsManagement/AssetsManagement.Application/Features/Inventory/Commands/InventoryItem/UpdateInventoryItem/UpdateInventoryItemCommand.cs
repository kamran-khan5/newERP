using FluentValidation;

public record UpdateInventoryItemResult(bool IsSuccess);
public record UpdateInventoryItemCommand(Guid Id, InventoryItemDto InventoryItem):ICommand<Result<UpdateInventoryItemResult>>;

public class UpdateInventoryItemCommandValidator:AbstractValidator<UpdateInventoryItemCommand>
{
  public UpdateInventoryItemCommandValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
    RuleFor(x => x.InventoryItem).SetValidator(new InventoryItemDtoValidator());
  }
}