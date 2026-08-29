using FluentValidation;

public sealed record GetCategoryResult(CategoryDto Category);
public sealed record GetCategoryQuery(Guid Id) : IQuery<Result<GetCategoryResult>>;

public class GetCategoryQueryValidator:AbstractValidator<GetCategoryQuery>
{
  public GetCategoryQueryValidator()
  {
  RuleFor(x => x.Id)
.NotEmpty()
.WithName("Id field is required");
  }
}