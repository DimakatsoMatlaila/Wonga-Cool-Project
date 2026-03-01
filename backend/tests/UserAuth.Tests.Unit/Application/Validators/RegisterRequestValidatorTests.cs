using FluentAssertions;
using FluentValidation.TestHelper;
using UserAuth.Application.DTOs.Auth;
using UserAuth.Application.Validators;
using Xunit;

namespace UserAuth.Tests.Unit.Application.Validators;

public class RegisterRequestValidatorTests
{
    private readonly RegisterRequestValidator _validator;

    public RegisterRequestValidatorTests()
    {
        _validator = new RegisterRequestValidator();
    }

    [Fact]
    public void Validate_WithValidRequest_ShouldNotHaveErrors()
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validate_WithEmptyFirstName_ShouldHaveError(string firstName)
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FirstName = firstName,
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = "Password123!"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Theory]
    [InlineData("invalid-email")]
    [InlineData("@example.com")]
    [InlineData("user@")]
    public void Validate_WithInvalidEmail_ShouldHaveError(string email)
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = email,
            Password = "Password123!"
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("short")]
    [InlineData("nouppercaseornumber1!")]
    [InlineData("NOLOWERCASEORNUMBER1!")]
    [InlineData("NoSpecialChar1")]
    [InlineData("NoNumber!")]
    public void Validate_WithWeakPassword_ShouldHaveError(string password)
    {
        // Arrange
        var request = new RegisterRequestDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john.doe@example.com",
            Password = password
        };

        // Act
        var result = _validator.TestValidate(request);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }
}
