namespace UserAuth.Application.Common.Exceptions;

/// <summary>
/// Custom exception for authentication and authorization errors
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message)
        : base(message)
    {
    }
}
