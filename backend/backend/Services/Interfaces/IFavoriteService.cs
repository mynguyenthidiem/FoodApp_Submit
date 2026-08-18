using backend.DTOs.Favorite;
using backend.DTOs.Food;
using backend.DTOs.Page;
using backend.DTOs.Restaurant;

namespace backend.Services.Interfaces
{
    public interface IFavoriteService
    {
        Task<FavoriteStatusDto> IsFoodFavoriteAsync(int userId, int foodId);
        Task AddFoodFavoriteAsync(int userId, int foodId);
        Task RemoveFoodFavoriteAsync(int userId, int foodId);
        Task<PagedResultDto<FoodDto>> GetFavoriteFoodsAsync(int userId, PaginationParams pagination);

        Task<FavoriteStatusDto> IsRestaurantFavoriteAsync(int userId, int restaurantId);
        Task AddRestaurantFavoriteAsync(int userId, int restaurantId);
        Task RemoveRestaurantFavoriteAsync(int userId, int restaurantId);
        Task<PagedResultDto<RestaurantDto>> GetFavoriteRestaurantsAsync(int userId, PaginationParams pagination);
    }
}
