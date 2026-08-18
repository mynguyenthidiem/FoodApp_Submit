using backend.Controllers;
using backend.DTOs.Order;
using backend.DTOs.Page;
using backend.Models;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class OrderControllerTests
{
    private readonly Mock<IOrderService> _service;
    private readonly OrderController _controller;

    public OrderControllerTests()
    {
        _service = new Mock<IOrderService>();
        _controller = new OrderController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Customer");
    }

    [Fact]
    public async Task GetOrders_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<OrderDto>(new List<OrderDto>(), 0, 1, 10);
        _service.Setup(s => s.GetOrdersAsync(1, pagination)).ReturnsAsync(paged);

        var result = await _controller.GetOrders(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetOrder_Existing_ShouldReturnOk()
    {
        var order = new OrderDto { Id = 1 };
        _service.Setup(s => s.GetOrderByIdAsync(1, 1)).ReturnsAsync(order);

        var result = await _controller.GetOrder(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(order, okResult.Value);
    }

    [Fact]
    public async Task GetOrder_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetOrderByIdAsync(1, 99))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.GetOrder(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetOrder_NotOwner_ShouldReturnForbid()
    {
        _service.Setup(s => s.GetOrderByIdAsync(1, 1))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.GetOrder(1);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task CreateOrder_Valid_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateOrderDto { ShippingAddress = "123 Street", CartIds = new List<int> { 1, 2 } };
        var order = new OrderDto { Id = 5 };
        _service.Setup(s => s.CreateOrderAsync(1, dto)).ReturnsAsync(order);

        var result = await _controller.CreateOrder(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(OrderController.GetOrder), createdResult.ActionName);
        Assert.Equal(order, createdResult.Value);
    }

    [Fact]
    public async Task CreateOrder_EmptyCart_ShouldReturnConflict()
    {
        var dto = new CreateOrderDto { ShippingAddress = "123 Street", CartIds = new List<int> { 1 } };
        _service.Setup(s => s.CreateOrderAsync(1, dto))
            .ThrowsAsync(new InvalidOperationException("Cart is empty."));

        var result = await _controller.CreateOrder(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task UpdateOrder_Valid_ShouldReturnOk()
    {
        var dto = new UpdateOrderDto { ShippingAddress = "New Address" };
        _service.Setup(s => s.UpdateOrderAsync(1, 5, dto)).Returns(Task.CompletedTask);

        var result = await _controller.UpdateOrder(5, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.UpdateOrderAsync(1, 5, dto), Times.Once);
    }

    [Fact]
    public async Task UpdateOrder_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateOrderDto { ShippingAddress = "New Address" };
        _service.Setup(s => s.UpdateOrderAsync(1, 99, dto))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.UpdateOrder(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task UpdateOrder_NotOwner_ShouldReturnForbid()
    {
        var dto = new UpdateOrderDto { ShippingAddress = "New Address" };
        _service.Setup(s => s.UpdateOrderAsync(1, 5, dto))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.UpdateOrder(5, dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task UpdateOrder_InvalidState_ShouldReturnConflict()
    {
        var dto = new UpdateOrderDto { ShippingAddress = "New Address" };
        _service.Setup(s => s.UpdateOrderAsync(1, 5, dto))
            .ThrowsAsync(new InvalidOperationException("Order cannot be updated in its current state."));

        var result = await _controller.UpdateOrder(5, dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task DeleteOrder_Success_ShouldReturnNoContent()
    {
        _service.Setup(s => s.DeleteOrderAsync(1, 1)).Returns(Task.CompletedTask);

        var result = await _controller.DeleteOrder(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task DeleteOrder_CannotBeCancelled_ShouldReturnConflict()
    {
        _service.Setup(s => s.DeleteOrderAsync(1, 1))
            .ThrowsAsync(new InvalidOperationException("Order cannot be cancelled."));

        var result = await _controller.DeleteOrder(1);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task UpdateStatus_Valid_ShouldReturnOk()
    {
        var dto = new UpdateOrderStatusDto { Status = OrderStatus.Confirmed };
        _service.Setup(s => s.UpdateOrderStatusAsync(1, 1, false, dto)).Returns(Task.CompletedTask);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");

        var result = await _controller.UpdateStatus(1, dto);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task UpdateStatus_InvalidTransition_ShouldReturnBadRequest()
    {
        var dto = new UpdateOrderStatusDto { Status = OrderStatus.Completed };
        _service.Setup(s => s.UpdateOrderStatusAsync(1, 1, false, dto))
            .ThrowsAsync(new ArgumentException("Invalid status transition."));
        ControllerTestHelper.SetUser(_controller, 1, "Owner");

        var result = await _controller.UpdateStatus(1, dto);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task GetRestaurantOrders_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<OrderDto>(new List<OrderDto>(), 0, 1, 10);
        _service.Setup(s => s.GetRestaurantOrdersAsync(1, pagination)).ReturnsAsync(paged);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");

        var result = await _controller.GetRestaurantOrders(pagination);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetAllOrders_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<OrderDto>(new List<OrderDto>(), 0, 1, 10);
        _service.Setup(s => s.GetAllOrdersAsync(pagination)).ReturnsAsync(paged);
        ControllerTestHelper.SetUser(_controller, 1, "Admin");

        var result = await _controller.GetAllOrders(pagination);

        Assert.IsType<OkObjectResult>(result);
    }

    // --- Authorization: Admin phải override được ownership check của Owner khác ---

    [Fact]
    public async Task UpdateStatus_AsAdmin_ShouldPassIsAdminTrueToService_EvenForAnotherOwnersRestaurant()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new UpdateOrderStatusDto { Status = OrderStatus.Confirmed };
        _service.Setup(s => s.UpdateOrderStatusAsync(1, 1, true, dto)).Returns(Task.CompletedTask);

        var result = await _controller.UpdateStatus(1, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.UpdateOrderStatusAsync(1, 1, true, dto), Times.Once);
        _service.Verify(s => s.UpdateOrderStatusAsync(1, 1, false, It.IsAny<UpdateOrderStatusDto>()), Times.Never);
    }

    [Fact]
    public async Task UpdateStatus_AsOwner_NotOwningRestaurant_ShouldReturnForbid()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Owner");
        var dto = new UpdateOrderStatusDto { Status = OrderStatus.Confirmed };
        _service.Setup(s => s.UpdateOrderStatusAsync(1, 1, false, dto))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.UpdateStatus(1, dto);

        Assert.IsType<ForbidResult>(result);
    }
}
