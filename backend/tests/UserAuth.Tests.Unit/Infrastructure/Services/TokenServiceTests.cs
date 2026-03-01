using FluentAssertions;
using Microsoft.Extensions.Configuration;
using UserAuth.Infrastructure.Services;
using Xunit;

namespace UserAuth.Tests.Unit.Infrastructure.Services;

public class TokenServiceTests
{
    private readonly TokenService _tokenService;

    public TokenServiceTests()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "ThisIsAVerySecretKeyForJWTTokenGenerationWithAtLeast32Characters!",
                ["Jwt:Issuer"] = "UserAuthAPI",
                ["Jwt:Audience"] = "UserAuthClient"
            })
            .Build();

        _tokenService = new TokenService(configuration);
    }

    [Fact]
    public void GenerateAccessToken_WithValidData_ShouldReturnToken()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var email = "test@example.com";

        // Act
        var token = _tokenService.GenerateAccessToken(userId, email);

        // Assert
        token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnUniqueTokens()
    {
        // Act
        var token1 = _tokenService.GenerateRefreshToken();
        var token2 = _tokenService.GenerateRefreshToken();

        // Assert
        token1.Should().NotBeNullOrEmpty();
        token2.Should().NotBeNullOrEmpty();
        token1.Should().NotBe(token2);
    }

    [Fact]
    public void ValidateToken_WithValidToken_ShouldReturnUserId()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var email = "test@example.com";
        var token = _tokenService.GenerateAccessToken(userId, email);

        // Act
        var result = _tokenService.ValidateToken(token);

        // Assert
        result.Should().Be(userId);
    }

    [Fact]
    public void ValidateToken_WithInvalidToken_ShouldReturnNull()
    {
        // Arrange
        var invalidToken = "invalid.token.here";

        // Act
        var result = _tokenService.ValidateToken(invalidToken);

        // Assert
        result.Should().BeNull();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void ValidateToken_WithEmptyToken_ShouldReturnNull(string token)
    {
        // Act
        var result = _tokenService.ValidateToken(token);

        // Assert
        result.Should().BeNull();
    }
}
