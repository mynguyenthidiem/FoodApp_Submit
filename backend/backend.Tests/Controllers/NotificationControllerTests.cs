using backend.Controllers;
using backend.DTOs.Notification;
using backend.DTOs.Page;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class NotificationControllerTests
{
    private readonly Mock<INotificationService> _service;
    private readonly NotificationController _controller;

    public NotificationControllerTests()
    {
        _service = new Mock<INotificationService>();
        _controller = new NotificationController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1);
    }

    [Fact]
    public async Task GetMyNotifications_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var paged = new PagedResultDto<NotificationDto>(new List<NotificationDto>(), 0, 1, 10);
        _service.Setup(s => s.GetByUser(1, pagination)).ReturnsAsync(paged);

        var result = await _controller.GetMyNotifications(pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(paged, okResult.Value);
    }

    [Fact]
    public async Task GetUnreadCount_ShouldReturnOkWithCount()
    {
        _service.Setup(s => s.GetUnreadCount(1)).ReturnsAsync(5);

        var result = await _controller.GetUnreadCount();

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task MarkAsRead_Success_ShouldReturnNoContent()
    {
        _service.Setup(s => s.MarkAsRead(1, 1)).Returns(Task.CompletedTask);

        var result = await _controller.MarkAsRead(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task MarkAsRead_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.MarkAsRead(99, 1))
            .ThrowsAsync(new KeyNotFoundException("Notification not found."));

        var result = await _controller.MarkAsRead(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task MarkAsRead_NotOwner_ShouldReturnForbid()
    {
        _service.Setup(s => s.MarkAsRead(1, 1))
            .ThrowsAsync(new UnauthorizedAccessException("Not allowed."));

        var result = await _controller.MarkAsRead(1);

        Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async Task MarkAllAsRead_ShouldReturnNoContent()
    {
        _service.Setup(s => s.MarkAllAsRead(1)).Returns(Task.CompletedTask);

        var result = await _controller.MarkAllAsRead();

        Assert.IsType<NoContentResult>(result);
        _service.Verify(s => s.MarkAllAsRead(1), Times.Once);
    }
}
