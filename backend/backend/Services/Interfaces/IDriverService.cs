using backend.DTOs.Auth;
using backend.DTOs.Driver;
using backend.DTOs.Order;
using backend.DTOs.Page;

namespace backend.Services.Interfaces
{
    public interface IDriverService
    {
        Task<UserResponseDto> CreateDriver(CreateDriverDto dto);

        Task<DriverProfileDto> GetProfile(int driverId);

        Task<DriverProfileDto> UpdateAvailability(int driverId, UpdateDriverAvailabilityDto dto);

        Task<PagedResultDto<OrderDto>> GetAvailableOrdersAsync(PaginationParams pagination);

        Task<PagedResultDto<OrderDto>> GetMyOrdersAsync(int driverId, PaginationParams pagination);

        Task AcceptOrderAsync(int orderId, int driverId);

        Task PickUpOrderAsync(int orderId, int driverId);

        Task CompleteOrderAsync(int orderId, int driverId);
    }
}
