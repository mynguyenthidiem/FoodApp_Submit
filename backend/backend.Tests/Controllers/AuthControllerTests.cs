using backend.Controllers;
using backend.DTOs.Auth;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _service;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        _service = new Mock<IAuthService>();
        _controller = new AuthController(_service.Object);
    }

    // Register

    [Fact]
    public async Task Register_ValidDto_ShouldReturn201WithResult()
    {
        var dto = new RegisterDto { FullName = "A", Email = "a@test.com", Password = "123456" };
        var response = new AuthResponseDto { Success = true, Token = "token" };
        _service.Setup(s => s.Register(dto)).ReturnsAsync(response);

        var result = await _controller.Register(dto);

        var objResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, objResult.StatusCode);
        Assert.Equal(response, objResult.Value);
    }

    [Fact]
    public async Task Register_EmailAlreadyExists_ShouldReturnConflict()
    {
        var dto = new RegisterDto { FullName = "A", Email = "a@test.com", Password = "123456" };
        _service.Setup(s => s.Register(dto))
            .ThrowsAsync(new InvalidOperationException("Email already exists."));

        var result = await _controller.Register(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task Register_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new RegisterDto();
        _controller.ModelState.AddModelError("Email", "Required");

        var result = await _controller.Register(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.Register(It.IsAny<RegisterDto>()), Times.Never);
    }

    // Login

    [Fact]
    public async Task Login_ValidCredentials_ShouldReturnOk()
    {
        var dto = new LoginDto { Email = "a@test.com", Password = "123456" };
        var response = new AuthResponseDto { Success = true, Token = "token" };
        _service.Setup(s => s.Login(dto)).ReturnsAsync(response);

        var result = await _controller.Login(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(response, okResult.Value);
    }

    [Fact]
    public async Task Login_WrongPassword_ShouldReturnUnauthorized()
    {
        var dto = new LoginDto { Email = "a@test.com", Password = "wrong" };
        _service.Setup(s => s.Login(dto))
            .ThrowsAsync(new UnauthorizedAccessException("Invalid credentials."));

        var result = await _controller.Login(dto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    // Profile

    [Fact]
    public async Task Profile_UserExists_ShouldReturnOk()
    {
        var user = new UserResponseDto { Id = 1, Email = "a@test.com" };
        _service.Setup(s => s.GetProfile(1)).ReturnsAsync(user);
        ControllerTestHelper.SetUser(_controller, 1);

        var result = await _controller.Profile();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(user, okResult.Value);
    }

    [Fact]
    public async Task Profile_UserNotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetProfile(1))
            .ThrowsAsync(new KeyNotFoundException("User not found."));
        ControllerTestHelper.SetUser(_controller, 1);

        var result = await _controller.Profile();

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // GoogleLogin

    [Fact]
    public async Task GoogleLogin_ValidToken_ShouldReturnOk()
    {
        var dto = new GoogleLoginDto { IdToken = "google-token" };
        var response = new AuthResponseDto { Success = true, Token = "token" };
        _service.Setup(s => s.LoginWithGoogle(dto)).ReturnsAsync(response);

        var result = await _controller.GoogleLogin(dto);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GoogleLogin_InvalidToken_ShouldReturnUnauthorized()
    {
        var dto = new GoogleLoginDto { IdToken = "bad-token" };
        _service.Setup(s => s.LoginWithGoogle(dto))
            .ThrowsAsync(new UnauthorizedAccessException("Invalid google token."));

        var result = await _controller.GoogleLogin(dto);

        Assert.IsType<UnauthorizedObjectResult>(result);
    }

    // ChangePassword

    [Fact]
    public async Task ChangePassword_ValidRequest_ShouldReturnOk()
    {
        var dto = new ChangePasswordDto { OldPassword = "old", NewPassword = "new" };
        _service.Setup(s => s.ChangePassword(1, dto)).ReturnsAsync(true);
        ControllerTestHelper.SetUser(_controller, 1);

        var result = await _controller.ChangePassword(dto);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task ChangePassword_WrongOldPassword_ShouldReturnConflict()
    {
        var dto = new ChangePasswordDto { OldPassword = "wrong", NewPassword = "new" };
        _service.Setup(s => s.ChangePassword(1, dto))
            .ThrowsAsync(new InvalidOperationException("Old password is incorrect."));
        ControllerTestHelper.SetUser(_controller, 1);

        var result = await _controller.ChangePassword(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }
}
