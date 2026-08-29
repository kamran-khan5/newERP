using FluentValidation;

public sealed record CreateCategoryResult(Guid Id);
public sealed record CreateCategoryCommand(CategoryDto Category) : ICommand<Result<CreateCategoryResult>>;

public class CreateCategoryCommandValidatory : AbstractValidator<CreateCategoryCommand>
{
  public CreateCategoryCommandValidatory()
  {
    RuleFor(x => x.Category).SetValidator(new CategoryDtoValidator());
  }
}

public class CategoryDtoValidator : AbstractValidator<CategoryDto>
{

  public CategoryDtoValidator()
  {
    RuleFor(x => x.Code).Code();
    RuleFor(x => x.Name).Name();
    RuleFor(x => x.Description)
        .MaximumLength(500)
        .WithMessage("Description cannot exceed 500 characters.");

    RuleFor(x => x.IsActive)
    .NotEmpty();
  }
}