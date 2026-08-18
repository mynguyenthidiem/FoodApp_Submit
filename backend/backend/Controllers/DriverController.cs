using backend.DTOs.Driver;
using backend.DTOs.Page;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/driver")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _service;

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        public DriverController(IDriverService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateDriver(CreateDriverDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var result = await _service.CreateDriver(dto);
                return StatusCode(StatusCodes.Status201Created, result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var profile = await _service.GetProfile(GetCurrentUserId());
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Driver")]
        [HttpPut("availability")]
        public async Task<IActionResult> UpdateAvailability(UpdateDriverAvailabilityDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var profile = await _service.UpdateAvailability(GetCurrentUserId(), dto);
                return Ok(profile);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("orders/available")]
        public async Task<IActionResult> GetAvailableOrders([FromQuery] PaginationParams pagination)
        {
            var orders = await _service.GetAvailableOrdersAsync(pagination);
            return Ok(orders);
        }

        [Authorize(Roles = "Driver")]
        [HttpGet("orders")]
        public async Task<IActionResult> GetMyOrders([FromQuery] PaginationParams pagination)
        {
            var orders = await _service.GetMyOrdersAsync(GetCurrentUserId(), pagination);
            return Ok(orders);
        }

        [Authorize(Roles = "Driver")]
        [HttpPost("orders/{id}/accept")]
        public async Task<IActionResult> AcceptOrder(int id)
        {
            try
            {
                await _service.AcceptOrderAsync(id, GetCurrentUserId());
                return Ok(new { message = "Order accepted successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Driver")]
        [HttpPut("orders/{id}/pickup")]
        public async Task<IActionResult> PickUpOrder(int id)
        {
            try
            {
                await _service.PickUpOrderAsync(id, GetCurrentUserId());
                return Ok(new { message = "Order marked as picked up." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }

        [Authorize(Roles = "Driver")]
        [HttpPut("orders/{id}/complete")]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            try
            {
                await _service.CompleteOrderAsync(id, GetCurrentUserId());
                return Ok(new { message = "Order marked as delivered." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
