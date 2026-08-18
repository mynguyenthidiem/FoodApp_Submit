using backend.Controllers;
using backend.DTOs.Page;
using backend.DTOs.Restaurant;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class RestaurantControllerTests
{
    private readonly Mock<IRestaurantService> _service;
    private readonly RestaurantController _controller;

    public RestaurantControllerTests()
    {
        _service = new Mock<IRestaurantService>();
        _controller = new RestaurantController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<RestaurantDto>(new List<RestaurantDto>(), 0, 1, 10);
        _service.Setup(s => s.GetAll(pagination)).ReturnsAsync(paged);

        var result = await _controller.GetAll(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetById_Existing_ShouldReturnOk()
    {
        var restaurant = new RestaurantDto { Id = 1, Name = "Test" };
        _service.Setup(s => s.GetById(1)).ReturnsAsync(restaurant);

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(restaurant, okResult.Value);
    }

    [Fact]
    public async Task GetById_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetById(99))
            .ThrowsAsync(new KeyNotFoundException("Restaurant not found."));

        var result = await _controller.GetById(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Create_Valid_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateRestaurantDto { Name = "Test", Address = "123 Street" };
        var created = new RestaurantDto { Id = 1, Name = "Test" };
        _service.Setup(s => s.Create(1, dto)).ReturnsAsync(created);

        var result = await _controller.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(RestaurantController.GetById), createdResult.ActionName);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task Create_InvalidData_ShouldReturnBadRequest()
    {
        var dto = new CreateRestaurantDto { Name = "Test", Address = "123 Street" };
        _service.Setup(s => s.Create(1, dto))
            .ThrowsAsync(new ArgumentException("Restaurant already exists."));

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateRestaurantDto { Name = "New", Address = "New Street" };
        _service.Setup(s => s.Update(99, 1, false, dto))
            .ThrowsAsync(new KeyNotFoundException("Restaurant not found."));

        var result = await _controller.Update(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotOwner_ShouldReturnForbid()
    {
        var dto = new UpdateRestaurantDto { Name = "New", Address = "New Street" };
        _service.Setup(s => s.Update(1, 1, false, dto))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.Update(1, dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Delete_Success_ShouldReturnOk()
    {
        _service.Setup(s => s.Delete(1, 1, false)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task SetActiveStatus_Existing_ShouldReturnOk()
    {
        _service.Setup(s => s.SetActiveStatus(1, true)).Returns(Task.CompletedTask);
        ControllerTestHelper.SetUser(_controller, 1, "Admin");

        var result = await _controller.SetActiveStatus(1, true);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task SetActiveStatus_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.SetActiveStatus(99, true))
            .ThrowsAsync(new KeyNotFoundException("Restaurant not found."));
        ControllerTestHelper.SetUser(_controller, 1, "Admin");

        var result = await _controller.SetActiveStatus(99, true);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // --- Authorization: Admin phải override được ownership check của Owner khác ---

    [Fact]
    public async Task Update_AsAdmin_ShouldPassIsAdminTrueToService_EvenForAnotherOwnersRestaurant()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new UpdateRestaurantDto { Name = "New", Address = "New Street" };
        _service.Setup(s => s.Update(1, 1, true, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(1, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.Update(1, 1, true, dto), Times.Once);
        _service.Verify(s => s.Update(1, 1, false, It.IsAny<UpdateRestaurantDto>()), Times.Never);
    }

    [Fact]
    public async Task Delete_AsAdmin_ShouldPassIsAdminTrueToService()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        _service.Setup(s => s.Delete(1, 1, true)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.Delete(1, 1, true), Times.Once);
    }

    [Fact]
    public async Task Delete_AsOwner_NotOwningRestaurant_ShouldReturnForbid()
    {
        _service.Setup(s => s.Delete(1, 1, false))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.Delete(1);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Search_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<RestaurantDto>(new List<RestaurantDto> { new() { Id = 1, Name = "Pho 24" } }, 1, 1, 10);
        _service.Setup(s => s.SearchAsync("pho", pagination)).ReturnsAsync(paged);

        var result = await _controller.Search("pho", pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetTopRated_ShouldReturnOk()
    {
        var restaurants = new List<RestaurantDto> { new() { Id = 1, Name = "Top Restaurant" } };
        _service.Setup(s => s.GetTopRatedAsync(10)).ReturnsAsync(restaurants);

        var result = await _controller.GetTopRated();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(restaurants, okResult.Value);
    }

    [Fact]
    public async Task GetTopRated_CustomCount_ShouldPassCountToService()
    {
        var restaurants = new List<RestaurantDto>();
        _service.Setup(s => s.GetTopRatedAsync(5)).ReturnsAsync(restaurants);

        var result = await _controller.GetTopRated(5);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.GetTopRatedAsync(5), Times.Once);
    }

    [Fact]
    public async Task GetOpenNow_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<RestaurantDto>(new List<RestaurantDto>(), 0, 1, 10);
        _service.Setup(s => s.GetOpenNowAsync(pagination)).ReturnsAsync(paged);

        var result = await _controller.GetOpenNow(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }
}
