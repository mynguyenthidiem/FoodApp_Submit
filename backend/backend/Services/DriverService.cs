using backend.DTOs.Auth;
using backend.DTOs.Driver;
using backend.DTOs.Order;
using backend.DTOs.Page;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Services.Interfaces;

namespace backend.Services
{
    public class DriverService : IDriverService
    {
        private readonly IDriverRepository _driverRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IUserRepository _userRepo;

        public DriverService(IDriverRepository driverRepo, IOrderRepository orderRepo, IUserRepository userRepo)
        {
            _driverRepo = driverRepo;
            _orderRepo = orderRepo;
            _userRepo = userRepo;
        }

        public async Task<UserResponseDto> CreateDriver(CreateDriverDto dto)
        {
            if (await _userRepo.ExistsEmail(dto.Email))
            {
                throw new InvalidOperationException("Email already exists.");
            }

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Phone = dto.Phone,
                Address = dto.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepo.Create(user);

            var driverRole = await _userRepo.GetRoleByName("Driver");
            if (driverRole == null)
            {
                throw new KeyNotFoundException("Driver role not found.");
            }

            await _userRepo.CreateUserRole(new UserRole
            {
                UserId = createdUser.Id,
                RoleId = driverRole.Id
            });

            await _driverRepo.CreateProfile(new DriverProfile
            {
                UserId = createdUser.Id,
                VehicleType = dto.VehicleType,
                LicensePlate = dto.LicensePlate,
                IsAvailable = false
            });

            var result = await _userRepo.GetById(createdUser.Id);

            return new UserResponseDto
            {
                Id = result!.Id,
                FullName = result.FullName,
                Email = result.Email,
                Phone = result.Phone,
                Address = result.Address,
                Avatar = result.Avatar,
                Roles = result.UserRoles.Where(x => x.Role != null).Select(x => x.Role!.Name).ToList()
            };
        }

        public async Task<DriverProfileDto> GetProfile(int driverId)
        {
            var profile = await _driverRepo.GetProfileByUserId(driverId);
            if (profile == null)
            {
                throw new KeyNotFoundException("Driver profile not found.");
            }
            return MapToDto(profile);
        }

        public async Task<DriverProfileDto> UpdateAvailability(int driverId, UpdateDriverAvailabilityDto dto)
        {
            var profile = await _driverRepo.GetProfileByUserId(driverId);
            if (profile == null)
            {
                throw new KeyNotFoundException("Driver profile not found.");
            }

            profile.IsAvailable = dto.IsAvailable;
            await _driverRepo.UpdateProfile(profile);

            return MapToDto(profile);
        }

        public async Task<PagedResultDto<OrderDto>> GetAvailableOrdersAsync(PaginationParams pagination)
        {
            var (items, totalCount) = await _orderRepo.GetAvailableOrdersForDriverAsync(pagination.PageNumber, pagination.PageSize);
            return new PagedResultDto<OrderDto>(items.Select(MapToOrderDto).ToList(), totalCount, pagination.PageNumber, pagination.PageSize);
        }

        public async Task<PagedResultDto<OrderDto>> GetMyOrdersAsync(int driverId, PaginationParams pagination)
        {
            var (items, totalCount) = await _orderRepo.GetDriverOrdersAsync(driverId, pagination.PageNumber, pagination.PageSize);
            return new PagedResultDto<OrderDto>(items.Select(MapToOrderDto).ToList(), totalCount, pagination.PageNumber, pagination.PageSize);
        }

        public async Task AcceptOrderAsync(int orderId, int driverId)
        {
            var profile = await _driverRepo.GetProfileByUserId(driverId);
            if (profile == null)
            {
                throw new KeyNotFoundException("Driver profile not found.");
            }
            if (!profile.IsAvailable)
            {
                throw new InvalidOperationException("You must be online (available) to accept orders.");
            }

            if (await _orderRepo.HasActiveDeliveryAsync(driverId))
            {
                throw new InvalidOperationException("You already have an order in progress. Complete it before accepting a new one.");
            }

            var order = await _orderRepo.GetByIdWithRestaurantAsync(orderId);
            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            if (order.Status != OrderStatus.Preparing)
            {
                throw new InvalidOperationException("This order is not ready for pickup yet.");
            }

            if (order.DriverId != null)
            {
                throw new InvalidOperationException("This order has already been accepted by another driver.");
            }

            order.DriverId = driverId;
            order.AssignedAt = DateTime.UtcNow;

            await _orderRepo.UpdateOrderAsync(order);

            profile.IsAvailable = false;
            await _driverRepo.UpdateProfile(profile);
        }

        public async Task PickUpOrderAsync(int orderId, int driverId)
        {
            var order = await GetOwnedOrderOrThrow(orderId, driverId);

            if (order.Status != OrderStatus.Preparing)
            {
                throw new InvalidOperationException("Cannot pick up this order in its current status.");
            }

            order.Status = OrderStatus.Delivering;
            order.PickedUpAt = DateTime.UtcNow;

            await _orderRepo.UpdateOrderAsync(order);
        }

        public async Task CompleteOrderAsync(int orderId, int driverId)
        {
            var order = await GetOwnedOrderOrThrow(orderId, driverId);

            if (order.Status != OrderStatus.Delivering)
            {
                throw new InvalidOperationException("Cannot complete this order in its current status.");
            }

            if (order.PaymentMethod == PaymentMethod.COD && order.Payment?.Status != PaymentStatus.Completed)
            {
                throw new InvalidOperationException("Please confirm COD payment has been collected before marking this order as delivered.");
            }

            order.Status = OrderStatus.Completed;
            order.DeliveredAt = DateTime.UtcNow;

            await _orderRepo.UpdateOrderAsync(order);

            var profile = await _driverRepo.GetProfileByUserId(driverId);
            if (profile != null)
            {
                profile.TotalDeliveries += 1;
                profile.IsAvailable = true;
                await _driverRepo.UpdateProfile(profile);
            }
        }

        private async Task<Order> GetOwnedOrderOrThrow(int orderId, int driverId)
        {
            var order = await _orderRepo.GetByIdWithRestaurantAsync(orderId);
            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }
            if (order.DriverId != driverId)
            {
                throw new UnauthorizedAccessException("You are not the driver assigned to this order.");
            }
            return order;
        }

        private static DriverProfileDto MapToDto(DriverProfile profile)
        {
            return new DriverProfileDto
            {
                UserId = profile.UserId,
                FullName = profile.User?.FullName ?? "",
                Phone = profile.User?.Phone,
                Avatar = profile.User?.Avatar,
                VehicleType = profile.VehicleType,
                LicensePlate = profile.LicensePlate,
                IsAvailable = profile.IsAvailable,
                Rating = profile.Rating,
                TotalDeliveries = profile.TotalDeliveries
            };
        }

        private static OrderDto MapToOrderDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                DeliveryFee = order.DeliveryFee,
                PaymentMethod = order.PaymentMethod,
                ShippingAddress = order.ShippingAddress,

                RestaurantName = order.Restaurant?.Name ?? "",
                RestaurantAddress = order.Restaurant?.Address ?? "",

                DriverId = order.DriverId,
                DriverName = order.Driver?.FullName,
                DriverPhone = order.Driver?.Phone,
                AssignedAt = order.AssignedAt,
                PickedUpAt = order.PickedUpAt,
                DeliveredAt = order.DeliveredAt,

                Payment = order.Payment == null ? null : new PaymentResponseDto
                {
                    Id = order.Payment.Id,
                    OrderId = order.Payment.OrderId,
                    Amount = order.Payment.Amount,
                    Status = order.Payment.Status,
                    TransactionId = order.Payment.TransactionId,
                    CreatedAt = order.Payment.CreatedAt
                },

                OrderDetails = order.OrderDetails.Select(d => new OrderDetailDto
                {
                    FoodId = d.FoodId,
                    FoodName = d.Food?.Name ?? "",
                    Price = d.Price,
                    Quantity = d.Quantity,
                    SubTotal = d.SubTotal
                }).ToList()
            };
        }
    }
}