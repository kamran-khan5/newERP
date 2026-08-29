using FluentValidation;

public record GetInventoryItemsQueryResult(Guid Id, IList<InventoryItemDto> InventoryItems);
public record GetInventoryItemsQuery(Guid Id) : IQuery<Result<GetInventoryItemsQueryResult>>;

public class GetInventoryItemsQueryValidator : AbstractValidator<GetInventoryItemsQuery>
{
  public GetInventoryItemsQueryValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
  }
}