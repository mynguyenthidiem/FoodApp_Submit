using backend.DTOs.Payment;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/payments")]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new UnauthorizedAccessException(
                    "User is not authenticated."
                );
            }

            return int.Parse(userId);
        }

        private static PaymentResponseDto MapToDto(Payment payment)
        {
            return new PaymentResponseDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Status = payment.Status,
                TransactionId = payment.TransactionId,
                CreatedAt = payment.CreatedAt,
                OrderStatus = payment.Order?.Status ?? default
            };
        }

        [HttpPost]
        public async Task<IActionResult> CreatePayment(
            [FromBody] CreatePaymentDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();

                var payment = await _paymentService.CreatePayment(
                    dto.OrderId,
                    userId,
                    dto.Method
                );

                return Ok(new
                {
                    message = "Payment created successfully.",
                    payment = MapToDto(payment)
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "An error occurred while creating payment."
                    }
                );
            }
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetPaymentByOrder(int orderId)
        {
            try
            {
                var payment = await _paymentService.GetByOrderId(orderId);

                if (payment == null)
                {
                    return NotFound(new
                    {
                        message = "Payment not found."
                    });
                }

                return Ok(MapToDto(payment));
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "An error occurred while getting payment."
                    }
                );
            }
        }

        [Authorize(Roles = "Owner")]
        [HttpPut("{orderId}/complete")]
        public async Task<IActionResult> CompleteCOD(
            int orderId,
            [FromBody] CompletePaymentDto dto)
        {
            try
            {
                var ownerId = GetCurrentUserId();

                await _paymentService.CompletePayment(
                    orderId,
                    ownerId,
                    dto.TransactionId
                );

                return Ok(new
                {
                    message = "Payment completed successfully."
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "An error occurred while completing payment."
                    }
                );
            }
        }

        [Authorize(Roles = "Owner")]
        [HttpPut("{orderId}/fail")]
        public async Task<IActionResult> FailPayment(int orderId)
        {
            try
            {
                await _paymentService.FailPayment(orderId);

                return Ok(new
                {
                    message = "Payment marked as failed."
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        message = "An error occurred while failing payment."
                    }
                );
            }
        }
    }
}