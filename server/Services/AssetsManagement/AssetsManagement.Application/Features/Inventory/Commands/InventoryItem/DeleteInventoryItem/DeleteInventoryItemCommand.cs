using FluentValidation;

public record DeleteInventoryItemResult(bool IsSuccess);
public record DeleteInventoryItemCommand(Guid Id) : ICommand<Result<DeleteInventoryItemResult>>;

public class DeleteInventoryItemCommandValidator : AbstractValidator<DeleteInventoryItemCommand>
{
  public DeleteInventoryItemCommandValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
  }
}
