using FluentValidation;

public sealed record GetPurchaseQueryResult(PurchaseDto Purchase);
public sealed record GetPurchaseQuery(Guid Id) : IQuery<Result<GetPurchaseQueryResult>>;
public class GetPurchaseQueryValidator : AbstractValidator<GetPurchaseQuery>
{
  public GetPurchaseQueryValidator()
  {
    RuleFor(x => x.Id)
   .NotEmpty()
   .WithMessage("Purchase Id is required");
  }
}
