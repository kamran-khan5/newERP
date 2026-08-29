using FluentValidation;

public sealed record CreateAssetCommandResult(Guid Id);

public sealed record CreateAssetCommand(AssetDto Asset) : ICommand<Result<CreateAssetCommandResult>>;

public class AssetDtoValidator : AbstractValidator<AssetDto>
{
  public AssetDtoValidator()
  {
    RuleFor(x => x.Code).Code();
    RuleFor(x => x.Name).Name();
    RuleFor(x => x.Description)
        .MaximumLength(500)
        .WithMessage("Description cannot exceed 500 characters.");

  }
}