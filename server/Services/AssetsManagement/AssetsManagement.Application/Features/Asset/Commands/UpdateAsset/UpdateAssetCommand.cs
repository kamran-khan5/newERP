using FluentValidation;

public sealed record UpdateAssetCommandResult(bool IsSuccess);
public sealed record UpdateAssetCommand(Guid Id, AssetDto Asset) : ICommand<Result<UpdateAssetCommandResult>>;

public class UpdateAssetCommandValidator : AbstractValidator<UpdateAssetCommand>
{
  public UpdateAssetCommandValidator()
  {
    RuleFor(x => x.Id)
   .NotEmpty()
   .WithName("Id field is required");

    RuleFor(x => x.Asset).SetValidator(new AssetDtoValidator())
    .NotNull()
    .WithMessage("Asset Data required");
  }
}