using backend.Controllers;
using backend.DTOs.Payment;
using backend.Models;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class PaymentControllerTests
{
    private readonly Mock<IPaymentService> _service;
    private readonly PaymentController _controller;

    public PaymentControllerTests()
    {
        _service = new Mock<IPaymentService>();
        _controller = new PaymentController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Owner");
    }

    [Fact]
    public async Task CreatePayment_Valid_ShouldReturnOk()
    {
        var dto = new CreatePaymentDto { OrderId = 1, Method = PaymentMethod.Online };
        var payment = new Payment { Id = 1, OrderId = 1, Amount = 100, Method = PaymentMethod.Online };
        _service.Setup(s => s.CreatePayment(1, 1, PaymentMethod.Online)).ReturnsAsync(payment);

        var result = await _controller.CreatePayment(dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
        _service.Verify(s => s.CreatePayment(1, 1, PaymentMethod.Online), Times.Once);
    }

    [Fact]
    public async Task CreatePayment_OrderNotFound_ShouldReturnNotFound()
    {
        var dto = new CreatePaymentDto { OrderId = 99, Method = PaymentMethod.Online };
        _service.Setup(s => s.CreatePayment(99, 1, PaymentMethod.Online))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.CreatePayment(dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task CreatePayment_NotOwner_ShouldReturnForbid()
    {
        var dto = new CreatePaymentDto { OrderId = 1, Method = PaymentMethod.Online };
        _service.Setup(s => s.CreatePayment(1, 1, PaymentMethod.Online))
            .ThrowsAsync(new UnauthorizedAccessException());

        var result = await _controller.CreatePayment(dto);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task CreatePayment_AlreadyExists_ShouldReturnConflict()
    {
        var dto = new CreatePaymentDto { OrderId = 1, Method = PaymentMethod.Online };
        _service.Setup(s => s.CreatePayment(1, 1, PaymentMethod.Online))
            .ThrowsAsync(new InvalidOperationException("Payment already exists for this order."));

        var result = await _controller.CreatePayment(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task CreatePayment_UnexpectedError_ShouldReturn500()
    {
        var dto = new CreatePaymentDto { OrderId = 1, Method = PaymentMethod.Online };
        _service.Setup(s => s.CreatePayment(1, 1, PaymentMethod.Online))
            .ThrowsAsync(new Exception("boom"));

        var result = await _controller.CreatePayment(dto);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
    }

    [Fact]
    public async Task GetPaymentByOrder_Existing_ShouldReturnOk()
    {
        var payment = new Payment { Id = 1, OrderId = 1, Amount = 100 };
        _service.Setup(s => s.GetByOrderId(1)).ReturnsAsync(payment);

        var result = await _controller.GetPaymentByOrder(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.NotNull(okResult.Value);
    }

    [Fact]
    public async Task GetPaymentByOrder_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetByOrderId(99)).ReturnsAsync((Payment?)null);

        var result = await _controller.GetPaymentByOrder(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetPaymentByOrder_UnexpectedError_ShouldReturn500()
    {
        _service.Setup(s => s.GetByOrderId(1)).ThrowsAsync(new Exception("boom"));

        var result = await _controller.GetPaymentByOrder(1);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
    }

    [Fact]
    public async Task FailPayment_Valid_ShouldReturnOk()
    {
        _service.Setup(s => s.FailPayment(1)).Returns(Task.CompletedTask);

        var result = await _controller.FailPayment(1);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.FailPayment(1), Times.Once);
    }

    [Fact]
    public async Task FailPayment_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.FailPayment(99))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.FailPayment(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task FailPayment_InvalidState_ShouldReturnConflict()
    {
        _service.Setup(s => s.FailPayment(1))
            .ThrowsAsync(new InvalidOperationException("Payment cannot be failed in its current state."));

        var result = await _controller.FailPayment(1);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task FailPayment_UnexpectedError_ShouldReturn500()
    {
        _service.Setup(s => s.FailPayment(1)).ThrowsAsync(new Exception("boom"));

        var result = await _controller.FailPayment(1);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
    }

    [Fact]
    public async Task CompleteCOD_Valid_ShouldReturnOk()
    {
        var dto = new CompletePaymentDto { TransactionId = "TX123" };
        _service.Setup(s => s.CompletePayment(1, 1, "TX123")).Returns(Task.CompletedTask);

        var result = await _controller.CompleteCOD(1, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.CompletePayment(1, 1, "TX123"), Times.Once);
    }

    [Fact]
    public async Task CompleteCOD_OrderNotFound_ShouldReturnNotFound()
    {
        var dto = new CompletePaymentDto { TransactionId = "TX123" };
        _service.Setup(s => s.CompletePayment(99, 1, "TX123"))
            .ThrowsAsync(new KeyNotFoundException("Order not found."));

        var result = await _controller.CompleteCOD(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task CompleteCOD_AlreadyPaid_ShouldReturnConflict()
    {
        var dto = new CompletePaymentDto { TransactionId = "TX123" };
        _service.Setup(s => s.CompletePayment(1, 1, "TX123"))
            .ThrowsAsync(new InvalidOperationException("Payment already completed."));

        var result = await _controller.CompleteCOD(1, dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task CompleteCOD_UnexpectedError_ShouldReturn500()
    {
        var dto = new CompletePaymentDto { TransactionId = "TX123" };
        _service.Setup(s => s.CompletePayment(1, 1, "TX123"))
            .ThrowsAsync(new Exception("boom"));

        var result = await _controller.CompleteCOD(1, dto);

        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status500InternalServerError, objectResult.StatusCode);
        Assert.NotNull(objectResult.Value);
    }
}