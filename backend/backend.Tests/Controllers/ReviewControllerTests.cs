using backend.Controllers;
using backend.DTOs.Page;
using backend.DTOs.Review;
using backend.Services.Interfaces;
using backend.Tests.TestHelpers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace backend.Tests.Controllers;

public class ReviewControllerTests
{
    private readonly Mock<IReviewService> _service;
    private readonly ReviewController _controller;

    public ReviewControllerTests()
    {
        _service = new Mock<IReviewService>();
        _controller = new ReviewController(_service.Object);
        ControllerTestHelper.SetUser(_controller, 1, "Customer");
    }

    [Fact]
    public async Task GetById_Existing_ShouldReturnOk()
    {
        var review = new ReviewResponseDto { Id = 1, FoodId = 1, Rating = 5 };
        _service.Setup(s => s.GetById(1)).ReturnsAsync(review);

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(review, okResult.Value);
    }

    [Fact]
    public async Task GetById_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.GetById(99))
            .ThrowsAsync(new KeyNotFoundException("Review not found."));

        var result = await _controller.GetById(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task GetByFood_ShouldReturnOk()
    {
        var pagination = new PaginationParams();
        var summary = new FoodRatingSummaryDto { FoodId = 1, AverageRating = 4.5, TotalReviews = 2 };
        _service.Setup(s => s.GetByFood(1, pagination)).ReturnsAsync(summary);

        var result = await _controller.GetByFood(1, pagination);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(summary, okResult.Value);
    }

    [Fact]
    public async Task Create_Valid_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateReviewDto { FoodId = 1, Rating = 5, Comment = "Great!" };
        var created = new ReviewResponseDto { Id = 10, FoodId = 1, Rating = 5 };
        _service.Setup(s => s.Create(1, dto)).ReturnsAsync(created);

        var result = await _controller.Create(dto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(ReviewController.GetById), createdResult.ActionName);
        Assert.Equal(created, createdResult.Value);
    }

    [Fact]
    public async Task Create_AlreadyReviewed_ShouldReturnConflict()
    {
        var dto = new CreateReviewDto { FoodId = 1, Rating = 5 };
        _service.Setup(s => s.Create(1, dto))
            .ThrowsAsync(new InvalidOperationException("You already reviewed this food."));

        var result = await _controller.Create(dto);

        Assert.IsType<ConflictObjectResult>(result);
    }

    [Fact]
    public async Task Create_InvalidModelState_ShouldReturnBadRequest()
    {
        var dto = new CreateReviewDto();
        _controller.ModelState.AddModelError("Rating", "Required");

        var result = await _controller.Create(dto);

        Assert.IsType<BadRequestObjectResult>(result);
        _service.Verify(s => s.Create(It.IsAny<int>(), It.IsAny<CreateReviewDto>()), Times.Never);
    }

    [Fact]
    public async Task Update_NotFound_ShouldReturnNotFound()
    {
        var dto = new UpdateReviewDto { Rating = 4 };
        _service.Setup(s => s.Update(99, 1, false, dto))
            .ThrowsAsync(new KeyNotFoundException("Review not found."));

        var result = await _controller.Update(99, dto);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    [Fact]
    public async Task Update_NotOwner_ShouldReturnForbid()
    {
        var dto = new UpdateReviewDto { Rating = 4 };
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
    public async Task Delete_NotFound_ShouldReturnNotFound()
    {
        _service.Setup(s => s.Delete(99, 1, false))
            .ThrowsAsync(new KeyNotFoundException("Review not found."));

        var result = await _controller.Delete(99);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    // --- Authorization: Admin phải override được ownership check của user khác ---
    // Lưu ý: ReviewController không có [Authorize(Roles=...)] riêng cho Update/Delete
    // (chỉ [Authorize] chung ở class), nên bất kỳ user đăng nhập nào cũng gọi được action;
    // quyền Admin-override hoàn toàn phụ thuộc vào IsCurrentUserAdmin() truyền xuống service.

    [Fact]
    public async Task Update_AsAdmin_ShouldPassIsAdminTrueToService_EvenForAnotherUsersReview()
    {
        ControllerTestHelper.SetUser(_controller, 1, "Admin");
        var dto = new UpdateReviewDto { Rating = 4 };
        _service.Setup(s => s.Update(1, 1, true, dto))
            .ReturnsAsync(new ReviewResponseDto { Id = 1, Rating = 4 });

        var result = await _controller.Update(1, dto);

        Assert.IsType<OkObjectResult>(result);
        _service.Verify(s => s.Update(1, 1, true, dto), Times.Once);
        _service.Verify(s => s.Update(1, 1, false, It.IsAny<UpdateReviewDto>()), Times.Never);
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
}
