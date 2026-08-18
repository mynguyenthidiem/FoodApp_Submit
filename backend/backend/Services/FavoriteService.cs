using backend.DTOs.Favorite;
using backend.DTOs.Food;
using backend.DTOs.Page;
using backend.DTOs.Restaurant;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepo;
        private readonly IFoodRepository _foodRepo;
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly IUrlService _urlService;

        public FavoriteService(
            IFavoriteRepository favoriteRepo,
            IFoodRepository foodRepo,
            IRestaurantRepository restaurantRepo,
            IUrlService urlService)
        {
            _favoriteRepo = favoriteRepo;
            _foodRepo = foodRepo;
            _restaurantRepo = restaurantRepo;
            _urlService = urlService;
        }

        public async Task<FavoriteStatusDto> IsFoodFavoriteAsync(int userId, int foodId)
        {
            var isFavorite = await _favoriteRepo.IsFoodFavoritedAsync(userId, foodId);
            return new FavoriteStatusDto { IsFavorite = isFavorite };
        }

        public async Task AddFoodFavoriteAsync(int userId, int foodId)
        {
            if (!await _foodRepo.ExistsAsync(foodId))
            {
                throw new KeyNotFoundException("Food not found.");
            }

            if (await _favoriteRepo.IsFoodFavoritedAsync(userId, foodId))
            {
                throw new InvalidOperationException("This food is already in your favorites.");
            }

            await _favoriteRepo.AddFoodFavoriteAsync(new FavoriteFood
            {
                UserId = userId,
                FoodId = foodId
            });
        }

        public async Task RemoveFoodFavoriteAsync(int userId, int foodId)
        {
            var removed = await _favoriteRepo.RemoveFoodFavoriteAsync(userId, foodId);
            if (!removed)
            {
                throw new KeyNotFoundException("This food is not in your favorites.");
            }
        }

        public async Task<PagedResultDto<FoodDto>> GetFavoriteFoodsAsync(int userId, PaginationParams pagination)
        {
            var (items, totalCount) = await _favoriteRepo.GetFavoriteFoodsAsync(userId, pagination.PageNumber, pagination.PageSize);
            return new PagedResultDto<FoodDto>(items.Select(MapFoodToDto).ToList(), totalCount, pagination.PageNumber, pagination.PageSize);
        }

        public async Task<FavoriteStatusDto> IsRestaurantFavoriteAsync(int userId, int restaurantId)
        {
            var isFavorite = await _favoriteRepo.IsRestaurantFavoritedAsync(userId, restaurantId);
            return new FavoriteStatusDto { IsFavorite = isFavorite };
        }

        public async Task AddRestaurantFavoriteAsync(int userId, int restaurantId)
        {
            var restaurant = await _restaurantRepo.GetById(restaurantId);
            if (restaurant == null)
            {
                throw new KeyNotFoundException("Restaurant not found.");
            }

            if (await _favoriteRepo.IsRestaurantFavoritedAsync(userId, restaurantId))
            {
                throw new InvalidOperationException("This restaurant is already in your favorites.");
            }

            await _favoriteRepo.AddRestaurantFavoriteAsync(new FavoriteRestaurant
            {
                UserId = userId,
                RestaurantId = restaurantId
            });
        }

        public async Task RemoveRestaurantFavoriteAsync(int userId, int restaurantId)
        {
            var removed = await _favoriteRepo.RemoveRestaurantFavoriteAsync(userId, restaurantId);
            if (!removed)
            {
                throw new KeyNotFoundException("This restaurant is not in your favorites.");
            }
        }

        public async Task<PagedResultDto<RestaurantDto>> GetFavoriteRestaurantsAsync(int userId, PaginationParams pagination)
        {
            var (items, totalCount) = await _favoriteRepo.GetFavoriteRestaurantsAsync(userId, pagination.PageNumber, pagination.PageSize);
            return new PagedResultDto<RestaurantDto>(items.Select(MapRestaurantToDto).ToList(), totalCount, pagination.PageNumber, pagination.PageSize);
        }


        private FoodDto MapFoodToDto(Food food)
        {
            return new FoodDto
            {
                Id = food.Id,
                Name = food.Name,
                Description = food.Description,
                Price = food.Price,
                Image = string.IsNullOrEmpty(food.Image) ? null : _urlService.GetAbsoluteUrl(food.Image),
                Status = food.Status,
                CategoryId = food.CategoryId,
                CategoryName = food.Category?.SystemCategory?.Name,
                RestaurantId = food.RestaurantId,
                RestaurantName = food.Restaurant?.Name,
                CreatedAt = food.CreatedAt
            };
        }

        private RestaurantDto MapRestaurantToDto(Restaurant restaurant)
        {
            return new RestaurantDto
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                Address = restaurant.Address,
                Description = restaurant.Description,
                ImageUrl = string.IsNullOrEmpty(restaurant.ImageUrl) ? null : _urlService.GetAbsoluteUrl(restaurant.ImageUrl),
                PhoneNumber = restaurant.PhoneNumber,
                Email = restaurant.Email,
                OpenTime = restaurant.OpenTime,
                CloseTime = restaurant.CloseTime,
                DeliveryFee = restaurant.DeliveryFee,
                Rating = restaurant.Rating,
                TotalReviews = restaurant.TotalReviews,
                IsActive = restaurant.IsActive,
                CreatedAt = restaurant.CreatedAt,
                OwnerId = restaurant.OwnerId,
                FoodCount = restaurant.Foods.Count(f => f.Status == FoodStatus.Available),
                CategoryCount = restaurant.Categories.Count,
                Categories = restaurant.Categories
                    .Select(c => c.SystemCategory!.Name)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToList()
            };
        }
    }
}
