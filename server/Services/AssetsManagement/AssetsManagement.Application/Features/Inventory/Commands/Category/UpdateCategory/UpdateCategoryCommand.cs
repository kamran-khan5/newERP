using FluentValidation;

public sealed record UpdateCategoryResult(bool IsSuccess);
public sealed record UpdateCategoryCommand(Guid Id, CategoryDto Category) : ICommand<Result<UpdateCategoryResult>>;
public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
  public UpdateCategoryCommandValidator()
  {
    RuleFor(x => x.Category.Id)
    .NotEmpty()
    .WithName("Id field is required");
    RuleFor(x => x.Category).SetValidator(new CategoryDtoValidator());
  }
}