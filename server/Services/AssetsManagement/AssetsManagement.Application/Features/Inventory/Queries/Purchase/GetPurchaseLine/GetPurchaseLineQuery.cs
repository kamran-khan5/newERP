using FluentValidation;

public sealed record GetPurchaseLineQueryResult(PurchaseLineDto PurchaseLine);
public sealed record GetPurchaseLineQuery(Guid Id):IQuery<Result<GetPurchaseLineQueryResult>>;
public class GetPurchaseLineQueryValidator:AbstractValidator<GetPurchaseLineQuery>
{
  public GetPurchaseLineQueryValidator()
  {
    RuleFor(x => x.Id)
    .NotEmpty()
    .WithMessage("Purchase Id is required");
  }
}