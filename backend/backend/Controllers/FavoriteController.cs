using backend.DTOs.Page;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/favorites")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _service;

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        public FavoriteController(IFavoriteService service)
        {
            _service = service;
        }

        [HttpGet("foods")]
        public async Task<IActionResult> GetFavoriteFoods([FromQuery] PaginationParams pagination)
        {
            var foods = await _service.GetFavoriteFoodsAsync(GetCurrentUserId(), pagination);
            return Ok(foods);
        }

        [HttpGet("foods/{foodId}/status")]
        public async Task<IActionResult> IsFoodFavorite(int foodId)
        {
            var status = await _service.IsFoodFavoriteAsync(GetCurrentUserId(), foodId);
            return Ok(status);
        }

        [HttpPost("foods/{foodId}")]
        public async Task<IActionResult> AddFoodFavorite(int foodId)
        {
            try
            {
                await _service.AddFoodFavoriteAsync(GetCurrentUserId(), foodId);
                return StatusCode(StatusCodes.Status201Created, new { message = "Added to favorites." });
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

        [HttpDelete("foods/{foodId}")]
        public async Task<IActionResult> RemoveFoodFavorite(int foodId)
        {
            try
            {
                await _service.RemoveFoodFavoriteAsync(GetCurrentUserId(), foodId);
                return NoContent();
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

        [HttpGet("restaurants")]
        public async Task<IActionResult> GetFavoriteRestaurants([FromQuery] PaginationParams pagination)
        {
            var restaurants = await _service.GetFavoriteRestaurantsAsync(GetCurrentUserId(), pagination);
            return Ok(restaurants);
        }

        [HttpGet("restaurants/{restaurantId}/status")]
        public async Task<IActionResult> IsRestaurantFavorite(int restaurantId)
        {
            var status = await _service.IsRestaurantFavoriteAsync(GetCurrentUserId(), restaurantId);
            return Ok(status);
        }

        [HttpPost("restaurants/{restaurantId}")]
        public async Task<IActionResult> AddRestaurantFavorite(int restaurantId)
        {
            try
            {
                await _service.AddRestaurantFavoriteAsync(GetCurrentUserId(), restaurantId);
                return StatusCode(StatusCodes.Status201Created, new { message = "Added to favorites." });
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

        [HttpDelete("restaurants/{restaurantId}")]
        public async Task<IActionResult> RemoveRestaurantFavorite(int restaurantId)
        {
            try
            {
                await _service.RemoveRestaurantFavoriteAsync(GetCurrentUserId(), restaurantId);
                return NoContent();
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
    }
}
