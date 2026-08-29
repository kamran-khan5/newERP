using Microsoft.Extensions.DependencyInjection;

namespace NewERP.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register Application services, validators, mediators, or handlers here
        return services;
    }
}
