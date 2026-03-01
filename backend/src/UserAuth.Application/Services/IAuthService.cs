using UserAuth.Application.DTOs.Auth;

namespace UserAuth.Application.Services;

/// <summary>
/// Interface for authentication service
/// </summary>
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<UserDto> GetUserDetailsAsync(Guid userId, CancellationToken cancellationToken = default);
}
