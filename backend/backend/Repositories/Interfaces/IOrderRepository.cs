using backend.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace backend.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<(List<Order> Items, int TotalCount)> GetUserOrdersAsync(int userId, int pageNumber, int pageSize);
        Task<List<Cart>> GetSelectedCartAsync(int userId, List<int> cartIds);
        Task ClearSelectedCartAsync(int userId, List<int> cartIds);
        Task<Order?> GetByIdAsync(int id);
        Task CreateOrderAsync(Order order);
        Task UpdateOrderAsync(Order order);
        Task DeleteOrderAsync(Order order);

        Task AddOrderDetailAsync(OrderDetail orderDetail);

        Task<List<Cart>> GetUserCartAsync(int userId);
        Task ClearCartAsync(int userId);

        Task SaveChangesAsync();
        Task<IDbContextTransaction> BeginTransactionAsync();

        Task<Order?> GetByIdWithRestaurantAsync(int id);
        Task<(List<Order> Items, int TotalCount)> GetRestaurantOrdersAsync(int ownerId, int pageNumber, int pageSize);

        Task<(List<Order> Items, int TotalCount)> GetAllOrdersAsync(int pageNumber, int pageSize);
        Task<(List<Order> Items, int TotalCount)> GetAvailableOrdersForDriverAsync(int pageNumber, int pageSize);
        Task<(List<Order> Items, int TotalCount)> GetDriverOrdersAsync(int driverId, int pageNumber, int pageSize);
        Task<bool> HasActiveDeliveryAsync(int driverId);
    }
}