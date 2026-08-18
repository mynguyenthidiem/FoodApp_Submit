using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IRestaurantRepository
    {
        Task<(List<Restaurant> Items, int TotalCount)> GetAll(int pageNumber, int pageSize);

        Task<Restaurant?> GetById(int id);

        Task Create(Restaurant restaurant);

        Task Update(Restaurant restaurant);

        Task Delete(int id);
        Task UpdateRestaurantRatingAsync(int restaurantId);
        Task DeactivateAllByOwnerAsync(int ownerId);
        Task<(List<Restaurant> Items, int TotalCount)> SearchAsync(string keyword, int pageNumber, int pageSize);
        Task<List<Restaurant>> GetTopRatedAsync(int count);
        Task<(List<Restaurant> Items, int TotalCount)> GetOpenNowAsync(TimeOnly currentTime, int pageNumber, int pageSize);
    }
}