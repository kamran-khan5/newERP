using FluentValidation;

public record DeletePurchaseLineCommandResult(bool IsSuccess);

public record DeletePurchaseLineCommand(Guid Id) : ICommand<Result<DeletePurchaseLineCommandResult>>;

public class DeletePurchaseLineCommandValidator : AbstractValidator<DeletePurchaseLineCommand>
{
  public DeletePurchaseLineCommandValidator()
  {
    RuleFor(x => x.Id)
     .NotEmpty()
     .WithMessage("Purchase Id is required");

  }
}