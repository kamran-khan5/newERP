public sealed record FileUrl(string Value)
{
  public static FileUrl Of(string value)
  {
    if (string.IsNullOrWhiteSpace(value))
      throw new ArgumentException("File URL cannot be empty.", nameof(value));

    if (!Uri.TryCreate(value, UriKind.Absolute, out var uri))
      throw new ArgumentException("Invalid file URL.", nameof(value));

    return new FileUrl(uri.ToString());
  }

  public override string ToString() => Value;
}