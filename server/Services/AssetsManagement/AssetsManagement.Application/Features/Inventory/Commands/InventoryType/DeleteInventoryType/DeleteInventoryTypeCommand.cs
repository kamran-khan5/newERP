using FluentValidation;

public sealed record DeleteInventoryTypeResult(bool IsSuccess);

public sealed record DeleteInventoryTypeCommand(Guid Id):ICommand<Result<DeleteInventoryTypeResult>>;

public class DeleteInventoryTypeCommandValidator : AbstractValidator<DeleteInventoryTypeCommand>
{
  public DeleteInventoryTypeCommandValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
  }
}