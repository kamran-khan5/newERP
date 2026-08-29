using System.ComponentModel.DataAnnotations;
using Mapster;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

public class CustomeExceptionHandler(ILogger<CustomeExceptionHandler> logger) : IExceptionHandler
{
  public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
  {
    logger.LogError("Error Message : {exceptionMessage}, Time of occurance {time}", exception.Message, DateTime.UtcNow);

    (string Title, string Detail, int StatusCode) details = exception switch
    {
      ValidationException => (
        Title: GetType().Name,
        Detail: exception.Message,
        StatusCode: StatusCodes.Status400BadRequest
      ),

      BadHttpRequestException => (
        Title: GetType().Name,
        Detail: exception.Message,
        StatusCode: StatusCodes.Status400BadRequest
      ),

      NotFoundException => (
        Title: GetType().Name,
        Detail: exception.Message,
        StatusCode: StatusCodes.Status404NotFound
        ),
      _ =>
            (
              Title: GetType().Name,
              Detail: exception.Message,
              StatusCode: StatusCodes.Status500InternalServerError
            )
    };

    var problemDetails = new ProblemDetails
    {
      Status = details.StatusCode,
      Title = details.Title,
      Detail = details.Detail,
      Instance = context.Request.Path
    };
    problemDetails.Extensions.Add("traceId", context.TraceIdentifier);
    if (exception is ValidationException validationException)
    {
      problemDetails.Extensions.Add("ValidationErrors", validationException.ValidationResult?.ErrorMessage ?? validationException.Message);
    }
    await context.Response.WriteAsJsonAsync(
      problemDetails,
      cancellationToken);
    return true;
  }
}
