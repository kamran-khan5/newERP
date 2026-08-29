using FluentValidation;

public sealed record DeletePurchaseCommandResult(bool IsSuccess);

public sealed record DeletePurchaseCommand(Guid Id) : ICommand<Result<DeletePurchaseCommandResult>>;

public class DeletePurchaseCommandValidator : AbstractValidator<DeletePurchaseCommand>
{
  public DeletePurchaseCommandValidator()
  {
    RuleFor(x => x.Id)
    .NotEmpty()
    .WithMessage("Purchase Id is required");
  }
}