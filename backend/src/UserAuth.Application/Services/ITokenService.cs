namespace UserAuth.Application.Services;

/// <summary>
/// Interface for JWT token generation and validation
/// </summary>
public interface ITokenService
{
    string GenerateAccessToken(Guid userId, string email);
    string GenerateRefreshToken();
    Guid? ValidateToken(string token);
}
