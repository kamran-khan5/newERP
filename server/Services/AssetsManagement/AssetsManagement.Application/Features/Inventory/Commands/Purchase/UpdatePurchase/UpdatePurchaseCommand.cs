using System.Data;
using FluentValidation;

public sealed record UpdatePurchaseCommandResult(bool IsSuccess);

public sealed record UpdatePurchaseCommand(Guid Id, PurchaseDto Purchase) : ICommand<Result<UpdatePurchaseCommandResult>>;

public class UpdatePurchaseCommandValidator : AbstractValidator<UpdatePurchaseCommand>
{
  public UpdatePurchaseCommandValidator()
  {
    RuleFor(x => x.Id)
    .NotEmpty()
    .WithMessage("Purchase Id is required");

    RuleFor(x => x.Purchase)
    .SetValidator(new PurchaseDtoValidator());
  }
}