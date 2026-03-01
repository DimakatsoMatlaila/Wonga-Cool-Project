using Microsoft.AspNetCore.Diagnostics;
using System.Net;
using System.Text.Json;
using UserAuth.Application.Common.Exceptions;

namespace UserAuth.API.Middleware;

/// <summary>
/// Global exception handler middleware
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

        context.Response.ContentType = "application/json";

        var (statusCode, message, errors) = exception switch
        {
            Application.Common.Exceptions.ValidationException validationEx => (
                HttpStatusCode.BadRequest,
                "Validation failed",
                validationEx.Errors
            ),
            UnauthorizedException => (
                HttpStatusCode.Unauthorized,
                exception.Message,
                null
            ),
            NotFoundException => (
                HttpStatusCode.NotFound,
                exception.Message,
                null
            ),
            _ => (
                HttpStatusCode.InternalServerError,
                "An error occurred while processing your request",
                null
            )
        };

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            status = (int)statusCode,
            message,
            errors
        };

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
