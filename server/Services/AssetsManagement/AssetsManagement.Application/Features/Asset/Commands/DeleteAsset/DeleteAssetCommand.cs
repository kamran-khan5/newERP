using FluentValidation;

public sealed record DeleteAssetCommandResult(bool IsSuccess);

public sealed record DeleteAssetCommand(Guid Id) : ICommand<Result<DeleteAssetCommandResult>>;

public class DeleteAssetCommandValidator : AbstractValidator<DeleteAssetCommand>
{
  public DeleteAssetCommandValidator()
  {
    RuleFor(x => x.Id)
    .NotEmpty()
    .WithName("Id field is required");
  }
}