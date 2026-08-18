using backend.Controllers;
using backend.DTOs.Food;
using backend.DTOs.Page;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class FoodsControllerTests
{
    private readonly Mock<IFoodService> _service;
    private readonly FoodsController _controller;

    public FoodsControllerTests()
    {
        _service = new Mock<IFoodService>();
        _controller = new FoodsController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");
    }

    [Fact]
    public async Task GetAll_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<FoodDto>(new List<FoodDto>(), 0, 1, 10);
        _service.Setup(s => s.GetAllAsync(pagination)).ReturnsAsync(paged);

        var result = await _controller.GetAll(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetById_Existing_ShouldReturnOk()
    {
        var food = new FoodDto { Id = 1, Name = "Pizza" };
        _service.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(food);

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(food, okResult.Value);
    }

    [Fact]
    public async Task GetById_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetByIdAsync(99))
            .ThrowsAsync(new KeyNotFoundException("Food not found."));

        var result = await _controller.GetById(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Search_EmptyKeyword_ShouldReturnBadRequest()
    {
        var result = await _controller.Search("", new PaginationParams());

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.SearchAsync(It.IsAny<string>(), It.IsAny<PaginationParams>()), Times.Never);
    }

    [Fact]
    public async Task Search_ValidKeyword_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<FoodDto>(new List<FoodDto>(), 0, 1, 10);
        _service.Setup(s => s.SearchAsync("pizza", pagination)).ReturnsAsync(paged);

        var result = await _controller.Search("pizza", pagination);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Create_Valid_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateFoodDto { Name = "Pizza", Price = 10, CategoryId = 1 };
        var food = new FoodDto { Id = 1, Name = "Pizza" };
        _service.Setup(s => s.CreateAsync(1, false, dto)).ReturnsAsync(food);

        var result = await _controller.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(FoodsController.GetById), createdResult.ActionName);
        Assert.Equal(food, createdResult.Value);
    }

    [Fact]
    public async Task Create_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new CreateFoodDto();
        _controller.ModelState.AddModelError("Name", "Required");

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.CreateAsync(It.IsAny<int>(), It.IsAny<bool>(), It.IsAny<CreateFoodDto>()), Times.Never);
    }

    [Fact]
    public async Task Create_NotOwner_ShouldReturnForbid()
    {
        var dto = new CreateFoodDto { Name = "Pizza", Price = 10, CategoryId = 1 };
        _service.Setup(s => s.CreateAsync(1, false, dto))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.Create(dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Update_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateFoodDto { Name = "Pizza", Price = 10, CategoryId = 1 };
        _service.Setup(s => s.UpdateAsync(99, 1, false, dto))
            .ThrowsAsync(new KeyNotFoundException("Food not found."));

        var result = await _controller.Update(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Delete_Success_ShouldReturnNoContent()
    {
        _service.Setup(s => s.DeleteAsync(1, 1, false)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_NotOwner_ShouldReturnForbid()
    {
        _service.Setup(s => s.DeleteAsync(1, 1, false))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.Delete(1);

        Assert.IsType<ForbidResult>(result);
    }

    // --- Authorization: Admin phải override được ownership check của Owner khác ---

    [Fact]
    public async Task Create_AsAdmin_ShouldPassIsAdminTrueToService_EvenForAnotherRestaurant()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new CreateFoodDto { Name = "Pizza", Price = 10, CategoryId = 1 };
        var food = new FoodDto { Id = 1, Name = "Pizza" };
        _service.Setup(s => s.CreateAsync(1, true, dto)).ReturnsAsync(food);

        var result = await _controller.Create(dto);

        Assert.IsType<CreatedAtActionResult>(result);
        _service.Verify(s => s.CreateAsync(1, true, dto), Times.Once);
        _service.Verify(s => s.CreateAsync(1, false, It.IsAny<CreateFoodDto>()), Times.Never);
    }

    [Fact]
    public async Task Update_AsAdmin_ShouldPassIsAdminTrueToService()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new UpdateFoodDto { Name = "Pizza", Price = 10, CategoryId = 1 };
        _service.Setup(s => s.UpdateAsync(1, 1, true, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(1, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.UpdateAsync(1, 1, true, dto), Times.Once);
    }

    [Fact]
    public async Task Delete_AsAdmin_ShouldPassIsAdminTrueToService()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        _service.Setup(s => s.DeleteAsync(1, 1, true)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
        _service.Verify(s => s.DeleteAsync(1, 1, true), Times.Once);
    }

    [Fact]
    public async Task GetByCategory_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<FoodDto>(new List<FoodDto> { new() { Id = 1, Name = "Pho Bo" } }, 1, 1, 10);
        _service.Setup(s => s.GetByCategoryAsync(2, pagination)).ReturnsAsync(paged);

        var result = await _controller.GetByCategory(2, pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetByRestaurant_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<FoodDto>(new List<FoodDto> { new() { Id = 1, Name = "Pho Bo" } }, 1, 1, 10);
        _service.Setup(s => s.GetByRestaurantAsync(3, pagination)).ReturnsAsync(paged);

        var result = await _controller.GetByRestaurant(3, pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }
}
