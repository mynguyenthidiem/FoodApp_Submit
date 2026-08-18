using backend.Controllers;
using backend.DTOs.Auth;
using backend.DTOs.Driver;
using backend.DTOs.Order;
using backend.DTOs.Page;
using backend.Models;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class DriverControllerTests
{
    private readonly Mock<IDriverService> _service;
    private readonly DriverController _controller;

    public DriverControllerTests()
    {
        _service = new Mock<IDriverService>();
        _controller = new DriverController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 7, "Driver");
    }

    [Fact]
    public async Task CreateDriver_Valid_ShouldReturnCreated()
    {
        var dto = new CreateDriverDto
        {
            FullName = "Nguyen Van A",
            Email = "driver@test.com",
            Password = "123456"
        };

        var user = new UserResponseDto
        {
            Id = 7,
            FullName = dto.FullName,
            Email = dto.Email,
            Roles = new List<string> { "Driver" }
        };

        _service.Setup(s => s.CreateDriver(dto)).ReturnsAsync(user);

        var result = await _controller.CreateDriver(dto);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, objectResult.StatusCode);
        Assert.Equal(user, objectResult.Value);
    }

    [Fact]
    public async Task GetProfile_Existing_ShouldReturnOk()
    {
        var profile = new DriverProfileDto
        {
            UserId = 7,
            FullName = "Nguyen Van A",
            VehicleType = VehicleType.Motorbike,
            IsAvailable = true
        };

        _service.Setup(s => s.GetProfile(7)).ReturnsAsync(profile);

        var result = await _controller.GetProfile();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(profile, okResult.Value);
    }

    [Fact]
    public async Task UpdateAvailability_InvalidModel_ShouldReturnBadRequest()
    {
        var dto = new UpdateDriverAvailabilityDto();
        _controller.ModelState.AddModelError("IsAvailable", "Required");

        var result = await _controller.UpdateAvailability(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.UpdateAvailability(It.IsAny<int>(), It.IsAny<UpdateDriverAvailabilityDto>()), Times.Never);
    }

    [Fact]
    public async Task GetAvailableOrders_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var orders = new PagedResultDto<OrderDto>(new List<OrderDto>(), 0, 1, 10);
        _service.Setup(s => s.GetAvailableOrdersAsync(pagination)).ReturnsAsync(orders);

        var result = await _controller.GetAvailableOrders(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(orders, okResult.Value);
    }

    [Fact]
    public async Task AcceptOrder_InvalidOperation_ShouldReturnConflict()
    {
        _service.Setup(s => s.AcceptOrderAsync(9, 7))
            .ThrowsAsync(new InvalidOperationException("Order cannot be accepted."));

        var result = await _controller.AcceptOrder(9);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task PickUpOrder_Unauthorized_ShouldReturnForbid()
    {
        _service.Setup(s => s.PickUpOrderAsync(9, 7))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.PickUpOrder(9);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task UpdateAvailability_Valid_ShouldReturnOk()
    {
        var dto = new UpdateDriverAvailabilityDto { IsAvailable = true };
        var profile = new DriverProfileDto
        {
            UserId = 7,
            FullName = "Nguyen Van A",
            VehicleType = VehicleType.Motorbike,
            IsAvailable = true
        };
        _service.Setup(s => s.UpdateAvailability(7, dto)).ReturnsAsync(profile);

        var result = await _controller.UpdateAvailability(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(profile, okResult.Value);
    }

    [Fact]
    public async Task UpdateAvailability_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateDriverAvailabilityDto { IsAvailable = true };
        _service.Setup(s => s.UpdateAvailability(7, dto))
            .ThrowsAsync(new KeyNotFoundException("Driver not found."));

        var result = await _controller.UpdateAvailability(dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetMyOrders_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var orders = new PagedResultDto<OrderDto>(new List<OrderDto>(), 0, 1, 10);
        _service.Setup(s => s.GetMyOrdersAsync(7, pagination)).ReturnsAsync(orders);

        var result = await _controller.GetMyOrders(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(orders, okResult.Value);
    }

    [Fact]
    public async Task AcceptOrder_Valid_ShouldReturnOk()
    {
        _service.Setup(s => s.AcceptOrderAsync(9, 7)).Returns(Task.CompletedTask);

        var result = await _controller.AcceptOrder(9);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.AcceptOrderAsync(9, 7), Times.Once);
    }

    [Fact]
    public async Task AcceptOrder_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.AcceptOrderAsync(99, 7))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.AcceptOrder(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task PickUpOrder_Valid_ShouldReturnOk()
    {
        _service.Setup(s => s.PickUpOrderAsync(9, 7)).Returns(Task.CompletedTask);

        var result = await _controller.PickUpOrder(9);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.PickUpOrderAsync(9, 7), Times.Once);
    }

    [Fact]
    public async Task PickUpOrder_InvalidOperation_ShouldReturnConflict()
    {
        _service.Setup(s => s.PickUpOrderAsync(9, 7))
            .ThrowsAsync(new InvalidOperationException("Order cannot be picked up in its current state."));

        var result = await _controller.PickUpOrder(9);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task CompleteOrder_Valid_ShouldReturnOk()
    {
        _service.Setup(s => s.CompleteOrderAsync(9, 7)).Returns(Task.CompletedTask);

        var result = await _controller.CompleteOrder(9);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.CompleteOrderAsync(9, 7), Times.Once);
    }

    [Fact]
    public async Task CompleteOrder_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.CompleteOrderAsync(99, 7))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.CompleteOrder(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task CompleteOrder_Unauthorized_ShouldReturnForbid()
    {
        _service.Setup(s => s.CompleteOrderAsync(9, 7))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.CompleteOrder(9);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task CompleteOrder_InvalidOperation_ShouldReturnConflict()
    {
        _service.Setup(s => s.CompleteOrderAsync(9, 7))
            .ThrowsAsync(new InvalidOperationException("Order cannot be completed in its current state."));

        var result = await _controller.CompleteOrder(9);

        Assert.IsType<ConflictObjectResult>(result);
    }
}
