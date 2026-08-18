using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IFavoriteRepository
    {
        Task<bool> IsFoodFavoritedAsync(int userId, int foodId);
        Task AddFoodFavoriteAsync(FavoriteFood favorite);
        Task<bool> RemoveFoodFavoriteAsync(int userId, int foodId);
        Task<(List<Food> Items, int TotalCount)> GetFavoriteFoodsAsync(int userId, int pageNumber, int pageSize);
        Task<bool> IsRestaurantFavoritedAsync(int userId, int restaurantId);
        Task AddRestaurantFavoriteAsync(FavoriteRestaurant favorite);
        Task<bool> RemoveRestaurantFavoriteAsync(int userId, int restaurantId);
        Task<(List<Restaurant> Items, int TotalCount)> GetFavoriteRestaurantsAsync(int userId, int pageNumber, int pageSize);
    }
}
