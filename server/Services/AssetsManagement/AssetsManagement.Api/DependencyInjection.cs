using Carter;

public static class DependencyInjection
{
  public static IServiceCollection AddApiServices(this IServiceCollection services)
  {
    services.AddCarter();
    return services;
  }

  public static WebApplication UseApiService(this WebApplication app)
  {
    app.MapCarter();
    return app;
  }
}