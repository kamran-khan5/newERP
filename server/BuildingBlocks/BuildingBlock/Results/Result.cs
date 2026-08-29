public class Result<T>
{
  public readonly string? Message;
  public readonly bool IsSuccess;
  public readonly T? Value;

  private Result(T value, bool isSuccess, string? message)
  {
    Value = value;
    Message = message;
    IsSuccess = isSuccess;

  }
  public static Result<T> Success(T value)
  {
    return new Result<T>(value, true, null);
  }

  public static Result<T> Failure(string message)
  {
    return new Result<T>(default!, false, message);
  }
}