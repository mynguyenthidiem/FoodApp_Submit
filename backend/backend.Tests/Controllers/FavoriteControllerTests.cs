using backend.Controllers;
using backend.DTOs.Favorite;
using backend.DTOs.Food;
using backend.DTOs.Page;
using backend.DTOs.Restaurant;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class FavoriteControllerTests
{
    private readonly Mock<IFavoriteService> _service;
    private readonly FavoriteController _controller;

    public FavoriteControllerTests()
    {
        _service = new Mock<IFavoriteService>();
        _controller = new FavoriteController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 3, "User");
    }

    [Fact]
    public async Task GetFavoriteFoods_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var foods = new PagedResultDto<FoodDto>(new List<FoodDto>(), 0, 1, 10);
        _service.Setup(s => s.GetFavoriteFoodsAsync(3, pagination)).ReturnsAsync(foods);

        var result = await _controller.GetFavoriteFoods(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(foods, okResult.Value);
    }

    [Fact]
    public async Task IsFoodFavorite_ShouldReturnOk()
    {
        var status = new FavoriteStatusDto { IsFavorite = true };
        _service.Setup(s => s.IsFoodFavoriteAsync(3, 10)).ReturnsAsync(status);

        var result = await _controller.IsFoodFavorite(10);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(status, okResult.Value);
    }

    [Fact]
    public async Task AddFoodFavorite_Valid_ShouldReturnCreated()
    {
        _service.Setup(s => s.AddFoodFavoriteAsync(3, 10)).Returns(Task.CompletedTask);

        var result = await _controller.AddFoodFavorite(10);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status201Created, objectResult.StatusCode);
    }

    [Fact]
    public async Task RemoveFoodFavorite_Valid_ShouldReturnNoContent()
    {
        _service.Setup(s => s.RemoveFoodFavoriteAsync(3, 10)).Returns(Task.CompletedTask);

        var result = await _controller.RemoveFoodFavorite(10);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task AddRestaurantFavorite_Conflict_ShouldReturnConflict()
    {
        _service.Setup(s => s.AddRestaurantFavoriteAsync(3, 20))
            .ThrowsAsync(new InvalidOperationException("Already favorited."));

        var result = await _controller.AddRestaurantFavorite(20);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task GetFavoriteRestaurants_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var restaurants = new PagedResultDto<RestaurantDto>(new List<RestaurantDto>(), 0, 1, 10);
        _service.Setup(s => s.GetFavoriteRestaurantsAsync(3, pagination)).ReturnsAsync(restaurants);

        var result = await _controller.GetFavoriteRestaurants(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(restaurants, okResult.Value);
    }

    [Fact]
    public async Task IsRestaurantFavorite_ShouldReturnOk()
    {
        var status = new FavoriteStatusDto { IsFavorite = true };
        _service.Setup(s => s.IsRestaurantFavoriteAsync(3, 20)).ReturnsAsync(status);

        var result = await _controller.IsRestaurantFavorite(20);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(status, okResult.Value);
    }

    [Fact]
    public async Task RemoveRestaurantFavorite_Valid_ShouldReturnNoContent()
    {
        _service.Setup(s => s.RemoveRestaurantFavoriteAsync(3, 20)).Returns(Task.CompletedTask);

        var result = await _controller.RemoveRestaurantFavorite(20);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task RemoveRestaurantFavorite_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.RemoveRestaurantFavoriteAsync(3, 99))
            .ThrowsAsync(new KeyNotFoundException("Favorite not found."));

        var result = await _controller.RemoveRestaurantFavorite(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
