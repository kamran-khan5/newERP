using System.Text.RegularExpressions;
using FluentValidation;

public static class ValidationExtensions
{
  private readonly static Regex CodePattern = new(@"^[A-Z]{3}-\d{3}$",
      RegexOptions.Compiled | RegexOptions.CultureInvariant);


  public static IRuleBuilderOptions<T, string> Code<T>(this IRuleBuilder<T, string> ruleBuilder)
  {
    return ruleBuilder
    .NotEmpty()
    .WithMessage("Code is required.")
    .MaximumLength(10)
    .Must(code => CodePattern.IsMatch(code.Trim().ToUpperInvariant()))
    .WithMessage("Code must be in the format ABC-001.");
  }

  public static IRuleBuilderOptions<T, string> Name<T>(this IRuleBuilder<T, string> ruleBuilder)
  {
    return ruleBuilder
    .NotEmpty()
    .WithMessage("Name is required.")
    .MaximumLength(100);
  }
}