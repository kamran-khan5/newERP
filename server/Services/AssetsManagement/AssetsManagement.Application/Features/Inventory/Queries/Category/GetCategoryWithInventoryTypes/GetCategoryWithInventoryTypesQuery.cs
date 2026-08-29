using FluentValidation;

public sealed record GetCategoryWithInventoryTypesQueryResult(Guid CategoryId,
  IList<InventoryTypeDto> InventoryTypes);
public sealed record GetCategoryWithInventoryTypesQuery(Guid Id) : IQuery<Result<GetCategoryWithInventoryTypesQueryResult>>;

public class GetCategoryWithInventoryTypesQueryValidator : AbstractValidator<GetCategoryWithInventoryTypesQuery>
{
  public GetCategoryWithInventoryTypesQueryValidator()
  {
    RuleFor(x => x.Id)
   .NotEmpty()
   .WithName("Id field is required");
  }
}