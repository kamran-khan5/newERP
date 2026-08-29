using FluentValidation;

public record GetInventoryItemQueryResult(InventoryItemDto InventoryItem);
public record GetInventoryItemQuery(Guid Id) : IQuery<Result<GetInventoryItemQueryResult>>;

public class GetInventoryItemQueryValidator : AbstractValidator<GetInventoryItemQuery>
{
  public GetInventoryItemQueryValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
  }
}