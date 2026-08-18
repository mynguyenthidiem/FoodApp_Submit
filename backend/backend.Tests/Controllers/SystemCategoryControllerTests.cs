using backend.Controllers;
using backend.DTOs.SystemCategory;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class SystemCategoryControllerTests
{
    private readonly Mock<ISystemCategoryService> _service;
    private readonly SystemCategoriesController _controller;

    public SystemCategoryControllerTests()
    {
        _service = new Mock<ISystemCategoryService>();
        _controller = new SystemCategoriesController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
    }

    [Fact]
    public async Task GetAll_ShouldReturnOkWithList()
    {
        var categories = new List<SystemCategoryDto> { new() { Id = 1, Name = "Food" } };
        _service.Setup(s => s.GetAllAsync()).ReturnsAsync(categories);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(categories, okResult.Value);
    }

    [Fact]
    public async Task Get_Existing_ShouldReturnOk()
    {
        var category = new SystemCategoryDto { Id = 1, Name = "Food" };
        _service.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(category);

        var result = await _controller.Get(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(category, okResult.Value);
    }

    [Fact]
    public async Task Get_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetByIdAsync(99))
            .ThrowsAsync(new KeyNotFoundException("System category not found."));

        var result = await _controller.Get(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Create_Valid_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateSystemCategoryDto { Name = "Food" };
        var created = new SystemCategoryDto { Id = 1, Name = "Food" };
        _service.Setup(s => s.CreateAsync(dto)).ReturnsAsync(created);

        var result = await _controller.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(SystemCategoriesController.Get), createdResult.ActionName);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task Create_DuplicateName_ShouldReturnBadRequest()
    {
        var dto = new CreateSystemCategoryDto { Name = "Food" };
        _service.Setup(s => s.CreateAsync(dto))
            .ThrowsAsync(new ArgumentException("Name already exists."));

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateSystemCategoryDto { Name = "Drinks" };
        _service.Setup(s => s.UpdateAsync(99, dto))
            .ThrowsAsync(new KeyNotFoundException("System category not found."));

        var result = await _controller.Update(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_Valid_ShouldReturnNoContent()
    {
        var dto = new UpdateSystemCategoryDto { Name = "Drinks" };
        _service.Setup(s => s.UpdateAsync(1, dto)).Returns(Task.CompletedTask);

        var result = await _controller.Update(1, dto);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_Success_ShouldReturnOk()
    {
        _service.Setup(s => s.DeleteAsync(1)).Returns(Task.CompletedTask);

        var result = await _controller.Delete(1);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task Delete_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.DeleteAsync(99))
            .ThrowsAsync(new KeyNotFoundException("System category not found."));

        var result = await _controller.Delete(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Search_ShouldReturnOkWithList()
    {
        var categories = new List<SystemCategoryDto> { new() { Id = 1, Name = "Food" } };
        _service.Setup(s => s.SearchAsync("foo")).ReturnsAsync(categories);

        var result = await _controller.Search("foo");

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(categories, okResult.Value);
    }
}
