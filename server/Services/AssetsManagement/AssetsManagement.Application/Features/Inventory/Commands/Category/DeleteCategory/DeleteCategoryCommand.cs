using FluentValidation;
using Microsoft.VisualBasic;

public sealed record DeleteCategoryResult(bool IsSuccess);
public sealed record DeleteCategoryCommand(Guid Id) : ICommand<Result<DeleteCategoryResult>>;


public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
  public DeleteCategoryCommandValidator()
  {
    RuleFor(x => x.Id)
   .NotEmpty()
   .WithName("Id field is required");
  }
}