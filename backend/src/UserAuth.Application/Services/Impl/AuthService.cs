using AutoMapper;
using Microsoft.Extensions.Logging;
using UserAuth.Application.Common.Exceptions;
using UserAuth.Application.DTOs.Auth;
using UserAuth.Domain.Entities;
using UserAuth.Domain.Repositories;

namespace UserAuth.Application.Services.Impl;

/// <summary>
/// Implementation of IAuthService
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWork unitOfWork,
        ITokenService tokenService,
        IMapper mapper,
        ILogger<AuthService> logger)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Attempting to register user with email: {Email}", request.Email);

        // Check if user already exists
        if (await _unitOfWork.Users.ExistsAsync(request.Email, cancellationToken))
        {
            _logger.LogWarning("Registration failed: User with email {Email} already exists", request.Email);
            throw new ValidationException("Email", "A user with this email already exists");
        }

        // Create user entity
        var user = _mapper.Map<User>(request);
        user.Id = Guid.NewGuid();
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        user.CreatedAt = DateTime.UtcNow;

        // Save user
        await _unitOfWork.Users.CreateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User registered successfully with ID: {UserId}", user.Id);

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Attempting to login user with email: {Email}", request.Email);

        // Get user by email
        var user = await _unitOfWork.Users.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null)
        {
            _logger.LogWarning("Login failed: User with email {Email} not found", request.Email);
            throw new UnauthorizedException("Invalid email or password");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed: Invalid password for user {Email}", request.Email);
            throw new UnauthorizedException("Invalid email or password");
        }

        // Check if user is active
        if (!user.IsActive)
        {
            _logger.LogWarning("Login failed: User {Email} is not active", request.Email);
            throw new UnauthorizedException("User account is not active");
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.Users.UpdateAsync(user, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User logged in successfully: {UserId}", user.Id);

        // Generate tokens
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Email);
        var refreshToken = _tokenService.GenerateRefreshToken();

        return new AuthResponseDto
        {
            Token = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            User = _mapper.Map<UserDto>(user)
        };
    }

    public async Task<UserDto> GetUserDetailsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching user details for user ID: {UserId}", userId);

        var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
        if (user == null)
        {
            _logger.LogWarning("User not found with ID: {UserId}", userId);
            throw new NotFoundException("User", userId);
        }

        return _mapper.Map<UserDto>(user);
    }
}
