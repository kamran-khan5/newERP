using FluentValidation;

public sealed record UpdatePurchaseLineCommandResult(bool IsSuccess);
public record UpdatePurchaseLineCommand(Guid Id, PurchaseLineDto 
PurchaseLine):ICommand<Result<UpdatePurchaseLineCommandResult>>;

public class UpdatePurchaseLineCommandValidator:AbstractValidator<UpdatePurchaseLineCommand>
{
  public UpdatePurchaseLineCommandValidator()
  {
    RuleFor(x => x.Id)
    .NotEmpty()
    .WithMessage("Purchase Line Id is Required");

    RuleFor(x => x.PurchaseLine)
    .SetValidator(new PurchaseLineDtoValidator());
  }
}