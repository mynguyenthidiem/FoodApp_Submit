using backend.Controllers;
using backend.DTOs.Category;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class CategoriesControllerTests
{
    private readonly Mock<ICategoryService> _service;
    private readonly CategoriesController _controller;

    public CategoriesControllerTests()
    {
        _service = new Mock<ICategoryService>();
        _controller = new CategoriesController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");
    }

    [Fact]
    public async Task GetAll_ShouldReturnOkWithList()
    {
        var categories = new List<CategoryDto> { new() { Id = 1, Name = "Drinks" } };
        _service.Setup(s => s.GetAllAsync()).ReturnsAsync(categories);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(categories, okResult.Value);
    }

    [Fact]
    public async Task Get_ExistingId_ShouldReturnOk()
    {
        var category = new CategoryDto { Id = 1, Name = "Drinks" };
        _service.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(category);

        var result = await _controller.Get(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(category, okResult.Value);
    }

    [Fact]
    public async Task Get_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetByIdAsync(99))
            .ThrowsAsync(new KeyNotFoundException("Category not found."));

        var result = await _controller.Get(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Create_ValidDto_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateCategoryDto { RestaurantId = 1, SystemCategoryId = 1 };
        var created = new CategoryDto { Id = 10, RestaurantId = 1, SystemCategoryId = 1 };
        _service.Setup(s => s.CreateAsync(1, false, dto)).ReturnsAsync(created);

        var result = await _controller.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(CategoriesController.Get), createdResult.ActionName);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task Create_InvalidRestaurant_ShouldReturnBadRequest()
    {
        var dto = new CreateCategoryDto { RestaurantId = 999, SystemCategoryId = 1 };
        _service.Setup(s => s.CreateAsync(1, false, dto))
            .ThrowsAsync(new ArgumentException("Restaurant not found."));

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateCategoryDto { SystemCategoryId = 2 };
        _service.Setup(s => s.UpdateAsync(1, 1, false, dto))
            .ThrowsAsync(new KeyNotFoundException("Category not found."));

        var result = await _controller.Update(1, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_Valid_ShouldReturnNoContent()
    {
        var dto = new UpdateCategoryDto { SystemCategoryId = 2 };
        _service.Setup(s => s.UpdateAsync(1, 1, false, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(1, dto);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_Success_ShouldReturnOk()
    {
        _service.Setup(s => s.DeleteAsync(1, 1, false)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Delete_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.DeleteAsync(99, 1, false))
            .ThrowsAsync(new KeyNotFoundException("Category not found."));

        var result = await _controller.Delete(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // --- Authorization: Admin phải override được ownership check của Owner khác ---

    [Fact]
    public async Task Update_AsAdmin_ShouldPassIsAdminTrueToService_RegardlessOfOwnership()
    {
        // Admin (id=1) sửa category thuộc nhà hàng của Owner khác (không phải id=1)
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new UpdateCategoryDto { SystemCategoryId = 2 };
        _service.Setup(s => s.UpdateAsync(1, 1, true, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(1, dto);

        Assert.IsType<NoContentResult>(result);
        // Controller phải truyền IsAdmin() = true xuống service, không được truyền false
        _service.Verify(s => s.UpdateAsync(1, 1, true, dto), Times.Once);
        _service.Verify(s => s.UpdateAsync(1, 1, false, It.IsAny<UpdateCategoryDto>()), Times.Never);
    }

    [Fact]
    public async Task Delete_AsAdmin_ShouldPassIsAdminTrueToService()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        _service.Setup(s => s.DeleteAsync(1, 1, true)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.DeleteAsync(1, 1, true), Times.Once);
    }

    [Fact]
    public async Task Update_AsOwner_NotOwningRestaurant_ShouldReturnForbid()
    {
        // Owner thường (không phải Admin) đụng vào category của nhà hàng khác
        // => service ném UnauthorizedAccessException, controller phải trả Forbid (403).
        var dto = new UpdateCategoryDto { SystemCategoryId = 2 };
        _service.Setup(s => s.UpdateAsync(1, 1, false, dto))
            .ThrowsAsync(new UnauthorizedAccessException("You are not allowed to manage this category."));

        var result = await _controller.Update(1, dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task Delete_AsOwner_NotOwningRestaurant_ShouldReturnForbid()
    {
        // Owner thường (không phải Admin) đụng vào category của nhà hàng khác
        // => service ném UnauthorizedAccessException, controller phải trả Forbid (403).
        _service.Setup(s => s.DeleteAsync(1, 1, false))
            .ThrowsAsync(new UnauthorizedAccessException("You are not allowed to manage this category."));

        var result = await _controller.Delete(1);

        Assert.IsType<ForbidResult>(result);
    }
}
