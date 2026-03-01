using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using UserAuth.Application.Services;
using UserAuth.Application.Services.Impl;
using System.Reflection;

namespace UserAuth.Application;

/// <summary>
/// Dependency injection configuration for Application layer
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Services
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
