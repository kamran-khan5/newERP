using MediatR;
using Microsoft.Extensions.Logging;

public class LoggingBehaviors<TRequest, TResponse>(ILogger<LoggingBehaviors<TRequest, TResponse>> logger) : IPipelineBehavior<TRequest, TResponse>
 where TRequest : IRequest
 where TResponse : notnull
{
  public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
  {
    logger.LogInformation("[START] Handle request = {Request} - Response = {Response} - RequestData = {RequestData}", typeof(TRequest).Name, typeof(TResponse).Name, request);


    var response = await next(cancellationToken);
    logger.LogInformation("[END] Handled {Request} With = {Response} ", typeof(TRequest).Name, typeof(TResponse).Name);
    return response;

  }
}