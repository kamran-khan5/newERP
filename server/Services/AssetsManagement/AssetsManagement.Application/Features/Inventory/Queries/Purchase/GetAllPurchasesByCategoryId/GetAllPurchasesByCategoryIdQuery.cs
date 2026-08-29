using FluentValidation;

public sealed record GetAllPurchasesByCategoryIdQueryResult(IEnumerable<PurchaseLineDto> PurchaseLine);

public sealed record GetAllPurchasesByCategoryIdQuery(Guid CategoryId) : IQuery<Result<GetAllPurchasesByCategoryIdQueryResult>>;

public class GetAllPurchasesByCategoryIdQueryValidator : AbstractValidator<GetAllPurchasesByCategoryIdQuery>
{
  public GetAllPurchasesByCategoryIdQueryValidator()
  {
    RuleFor(x => x.CategoryId)
   .NotEmpty()
   .WithMessage("Category Id is required");
  }
}