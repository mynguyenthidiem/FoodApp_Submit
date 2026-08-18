using backend.Controllers;
using backend.DTOs.Auth;
using backend.DTOs.Page;
using backend.DTOs.User;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class UserControllerTests
{
    private readonly Mock<IUserService> _service;
    private readonly UserController _controller;

    public UserControllerTests()
    {
        _service = new Mock<IUserService>();
        _controller = new UserController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
    }

    [Fact]
    public async Task GetById_Existing_ShouldReturnOk()
    {
        var user = new UserResponseDto { Id = 1, Email = "a@test.com" };
        _service.Setup(s => s.GetById(1, 1, true)).ReturnsAsync(user);

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(user, okResult.Value);
    }

    [Fact]
    public async Task GetById_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetById(99, 1, true))
            .ThrowsAsync(new KeyNotFoundException("User not found."));

        var result = await _controller.GetById(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetById_NotAllowed_ShouldReturnForbid()
    {
        _service.Setup(s => s.GetById(2, 1, true))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.GetById(2);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task UpdateProfile_Valid_ShouldReturnOk()
    {
        var dto = new UpdateProfileDto { FullName = "New Name" };
        var user = new UserResponseDto { Id = 1, FullName = "New Name" };
        _service.Setup(s => s.UpdateProfile(1, dto, 1, true)).ReturnsAsync(user);

        var result = await _controller.UpdateProfile(1, dto);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task UpdateProfile_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new UpdateProfileDto();
        _controller.ModelState.AddModelError("FullName", "Required");

        var result = await _controller.UpdateProfile(1, dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.UpdateProfile(It.IsAny<int>(), It.IsAny<UpdateProfileDto>(), It.IsAny<int>(), It.IsAny<bool>()), Times.Never);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<UserResponseDto>(new List<UserResponseDto>(), 0, 1, 10);
        _service.Setup(s => s.GetAll(pagination)).ReturnsAsync(paged);

        var result = await _controller.GetAll(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task Delete_SelfAccount_ShouldReturnBadRequest()
    {
        var result = await _controller.Delete(1);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.Delete(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task Delete_OtherUser_ShouldReturnNoContent()
    {
        _service.Setup(s => s.Delete(2)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(2);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.Delete(99))
            .ThrowsAsync(new KeyNotFoundException("User not found."));

        var result = await _controller.Delete(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task CreateOwner_Valid_ShouldReturn201()
    {
        var dto = new CreateOwnerDto { FullName = "Owner", Email = "owner@test.com", Password = "123456" };
        var created = new UserResponseDto { Id = 5, Email = "owner@test.com" };
        _service.Setup(s => s.CreateOwner(dto)).ReturnsAsync(created);

        var result = await _controller.CreateOwner(dto);

        var objResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, objResult.StatusCode);
        Assert.Equal(created, objResult.Value);
    }

    [Fact]
    public async Task CreateOwner_EmailExists_ShouldReturnConflict()
    {
        var dto = new CreateOwnerDto { FullName = "Owner", Email = "owner@test.com", Password = "123456" };
        _service.Setup(s => s.CreateOwner(dto))
            .ThrowsAsync(new InvalidOperationException("Email already exists."));

        var result = await _controller.CreateOwner(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task CreateOwner_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new CreateOwnerDto();
        _controller.ModelState.AddModelError("Email", "Required");

        var result = await _controller.CreateOwner(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.CreateOwner(It.IsAny<CreateOwnerDto>()), Times.Never);
    }

    // --- Authorization: Admin phải xem/sửa được profile của user khác (self-or-admin) ---

    [Fact]
    public async Task GetById_AsAdmin_ShouldPassIsAdminTrueToService_ForAnotherUser()
    {
        // controller đã SetUser(1, "Admin") trong constructor
        var otherUser = new UserResponseDto { Id = 2, Email = "other@test.com" };
        _service.Setup(s => s.GetById(2, 1, true)).ReturnsAsync(otherUser);

        var result = await _controller.GetById(2);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(otherUser, okResult.Value);
        _service.Verify(s => s.GetById(2, 1, true), Times.Once);
    }

    [Fact]
    public async Task UpdateProfile_AsAdmin_ShouldPassIsAdminTrueToService_ForAnotherUser()
    {
        var dto = new UpdateProfileDto { FullName = "Edited By Admin" };
        var updated = new UserResponseDto { Id = 2, FullName = "Edited By Admin" };
        _service.Setup(s => s.UpdateProfile(2, dto, 1, true)).ReturnsAsync(updated);

        var result = await _controller.UpdateProfile(2, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.UpdateProfile(2, dto, 1, true), Times.Once);
    }

    [Fact]
    public async Task GetById_AsRegularUser_AccessingOthersProfile_ShouldReturnForbid()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Customer");
        _service.Setup(s => s.GetById(2, 1, false))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.GetById(2);

        Assert.IsType<ForbidResult>(result);
    }
}
