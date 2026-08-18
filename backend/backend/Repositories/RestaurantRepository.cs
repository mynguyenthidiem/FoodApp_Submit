using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly AppDbContext _context;

        public RestaurantRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(List<Restaurant> Items, int TotalCount)> GetAll(int pageNumber, int pageSize)
        {
            var query = _context.Restaurants
                .Where(r => r.IsActive)

                .Include(r => r.Foods
                    .Where(f => f.Status == FoodStatus.Available))

                .Include(r => r.Categories
                    .Where(c => c.IsActive))
                    .ThenInclude(c => c.SystemCategory)

                .OrderByDescending(r => r.Rating)
                .AsNoTracking();

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<Restaurant?> GetById(int id)
        {
            return await _context.Restaurants
                .Include(r => r.Categories.Where(c => c.IsActive)).ThenInclude(c => c.SystemCategory)
                .Include(r => r.Foods.Where(f => f.Status == FoodStatus.Available)).ThenInclude(f => f.Category).ThenInclude(c => c.SystemCategory)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);
        }

        public async Task Create(Restaurant restaurant)
        {
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
        }
        public async Task<(List<Restaurant>, int)> SearchAsync(
    string keyword,
    int pageNumber,
    int pageSize)
        {
            keyword = keyword.Trim();

            var baseQuery = _context.Restaurants
                .Where(r =>
                    r.IsActive &&
                    (
                        r.Name.Contains(keyword) ||
                        r.Address.Contains(keyword) ||
                        r.Description.Contains(keyword) ||

                        r.Foods.Any(f =>
                            f.Status == FoodStatus.Available &&
                            f.Name.Contains(keyword))
                    ));

            var totalCount = await baseQuery.CountAsync();

            var items = await baseQuery
                .OrderByDescending(r => r.Rating)
                .ThenBy(r => r.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(r => r.Foods)
                .Include(r => r.Categories)
                    .ThenInclude(c => c.SystemCategory)
                .AsSplitQuery()
                .AsNoTracking()
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<List<Restaurant>> GetTopRatedAsync(int count)
        {
            return await _context.Restaurants
                .Include(r => r.Foods)
                .Include(r => r.Categories).ThenInclude(c => c.SystemCategory)
                .Where(r => r.IsActive)
                .OrderByDescending(r => r.Rating)
                .ThenByDescending(r => r.TotalReviews)
                .Take(count)
                .ToListAsync();
        }

        public async Task<(List<Restaurant>, int)> GetOpenNowAsync(TimeOnly currentTime, int pageNumber, int pageSize)
        {
            var query = _context.Restaurants
                .Include(r => r.Foods)
                .Include(r => r.Categories).ThenInclude(c => c.SystemCategory)
                .Where(r => r.IsActive && (
                    r.OpenTime <= r.CloseTime
                        ? (currentTime >= r.OpenTime && currentTime <= r.CloseTime)
                        : (currentTime >= r.OpenTime || currentTime <= r.CloseTime)
                ));
            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(r => r.Rating)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
        public async Task Update(Restaurant restaurant)
        {
            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
            {
                throw new Exception("Restaurant not found.");
            }

            restaurant.IsActive = false;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRestaurantRatingAsync(int restaurantId)
        {
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null) return;

            var stats = await _context.Reviews
                .Where(r => r.Food.RestaurantId == restaurantId)
                .GroupBy(r => 1)
                .Select(g => new
                {
                    Count = g.Count(),
                    Avg = g.Average(r => r.Rating)
                })
                .FirstOrDefaultAsync();

            if (stats != null && stats.Count > 0)
            {
                restaurant.TotalReviews = stats.Count;
                restaurant.Rating = Math.Round(stats.Avg, 1);
            }
            else
            {
                restaurant.TotalReviews = 0;
                restaurant.Rating = 0;
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeactivateAllByOwnerAsync(int ownerId)
        {
            var restaurants = await _context.Restaurants
                .Where(r => r.OwnerId == ownerId && r.IsActive)
                .ToListAsync();

            foreach (var restaurant in restaurants)
            {
                restaurant.IsActive = false;
            }

            await _context.SaveChangesAsync();
        }

    }
}