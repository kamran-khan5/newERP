using FluentValidation;

public record GetInventoryTypeResult(InventoryTypeDto InventoryType);
public sealed record GetInventoryTypeQuery(Guid Id):IQuery<Result<GetInventoryTypeResult>>;

public class GetInventoryTypeQueryValidator : AbstractValidator<GetInventoryTypeQuery>
{
  public GetInventoryTypeQueryValidator()
  {
    RuleFor(x => x.Id).NotEmpty().WithMessage("Id is Required");
  }
}
