using backend.Controllers;
using backend.DTOs.Cart;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class CartControllerTests
{
    private readonly Mock<ICartService> _service;
    private readonly CartController _controller;

    public CartControllerTests()
    {
        _service = new Mock<ICartService>();
        _controller = new CartController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1);
    }

    [Fact]
    public async Task GetCart_ShouldReturnOkWithCartList()
    {
        var carts = new List<CartDto> { new() { Id = 1, FoodId = 1, Quantity = 2 } };
        _service.Setup(s => s.GetCartAsync(1)).ReturnsAsync(carts);

        var result = await _controller.GetCart();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(carts, okResult.Value);
    }

    [Fact]
    public async Task AddToCart_ValidDto_ShouldReturnOk()
    {
        var dto = new AddCartDto { FoodId = 1, Quantity = 2 };
        var cartDto = new CartDto { Id = 1, FoodId = 1, Quantity = 2 };
        _service.Setup(s => s.AddToCartAsync(1, dto)).ReturnsAsync(cartDto);

        var result = await _controller.AddToCart(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(cartDto, okResult.Value);
    }

    [Fact]
    public async Task AddToCart_FoodNotFound_ShouldReturnNotFound()
    {
        var dto = new AddCartDto { FoodId = 999, Quantity = 1 };
        _service.Setup(s => s.AddToCartAsync(1, dto))
            .ThrowsAsync(new KeyNotFoundException("Food not found."));

        var result = await _controller.AddToCart(dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task AddToCart_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new AddCartDto();
        _controller.ModelState.AddModelError("Quantity", "Required");

        var result = await _controller.AddToCart(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.AddToCartAsync(It.IsAny<int>(), It.IsAny<AddCartDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdateCart_Valid_ShouldReturnOk()
    {
        var dto = new UpdateCartDto { Quantity = 3 };
        _service.Setup(s => s.UpdateCartAsync(1, 100, dto)).Returns(Task.CompletedTask);

        var result = await _controller.UpdateCart(100, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.UpdateCartAsync(1, 100, dto), Times.Once);
    }

    [Fact]
    public async Task UpdateCart_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new UpdateCartDto { Quantity = 0 };
        _controller.ModelState.AddModelError("Quantity", "Range");

        var result = await _controller.UpdateCart(100, dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.UpdateCartAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<UpdateCartDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdateCart_CartNotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateCartDto { Quantity = 3 };
        _service.Setup(s => s.UpdateCartAsync(1, 100, dto))
            .ThrowsAsync(new KeyNotFoundException("Cart not found."));

        var result = await _controller.UpdateCart(100, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateCart_NotOwner_ShouldReturnForbid()
    {
        var dto = new UpdateCartDto { Quantity = 3 };
        _service.Setup(s => s.UpdateCartAsync(1, 100, dto))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.UpdateCart(100, dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task DeleteCart_Success_ShouldReturnOk()
    {
        _service.Setup(s => s.DeleteCartAsync(1, 5)).Returns(Task.CompletedTask);

        var result = await _controller.DeleteCart(5);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.DeleteCartAsync(1, 5), Times.Once);
    }

    [Fact]
    public async Task DeleteCart_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.DeleteCartAsync(1, 5))
            .ThrowsAsync(new KeyNotFoundException("Cart not found."));

        var result = await _controller.DeleteCart(5);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task ClearCart_ShouldReturnOk()
    {
        _service.Setup(s => s.ClearCartAsync(1)).Returns(Task.CompletedTask);

        var result = await _controller.ClearCart();

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.ClearCartAsync(1), Times.Once);
    }
}
