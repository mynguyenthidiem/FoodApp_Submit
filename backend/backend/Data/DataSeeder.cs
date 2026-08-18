using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class SeedRestaurant
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public string Address { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Email { get; set; } = "";
        public string OpenTime { get; set; } = "";
        public string CloseTime { get; set; } = "";
        public decimal DeliveryFee { get; set; }
        public double Rating { get; set; }
        public int TotalReviews { get; set; }
        public bool IsActive { get; set; }
    }

    public class SeedFood
    {
        public int RestaurantId { get; set; }
        public string CategoryName { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public decimal Price { get; set; }
        public string Image { get; set; } = "";
    }

    public static class DataSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            if (await context.Users.AnyAsync() || await context.Roles.AnyAsync())
            {
                return;
            }

            using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                await SeedInternalAsync(context);
                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private static async Task SeedInternalAsync(AppDbContext context)
        {
            // ============ 1. ROLES ============
            // Tên role phải khớp chính xác với các [Authorize(Roles = "...")] trong Controllers
            var roleAdmin = new Role { Name = "Admin", Description = "System administrator" };
            var roleOwner = new Role { Name = "Owner", Description = "Restaurant owner" };
            var roleCustomer = new Role { Name = "Customer", Description = "Customer" };
            var roleDriver = new Role { Name = "Driver", Description = "Delivery driver" };
            context.Roles.AddRange(roleAdmin, roleOwner, roleCustomer, roleDriver);
            await context.SaveChangesAsync();

            // ============ 2. USERS ============
            // Mật khẩu demo cho tất cả tài khoản seed: "123456"
            string demoPasswordHash = BCrypt.Net.BCrypt.HashPassword("123456");

            var admin = new User
            {
                FullName = "System Admin",
                Email = "admin@gmail.com",
                Password = demoPasswordHash,
                Phone = "0900000000",
                Avatar = "/images/Users/admin.jpg",
                IsActive = true,
            };

            var customer = new User
            {
                FullName = "Nguyen Van Khach",
                Email = "customer@gmail.com",
                Password = demoPasswordHash,
                Phone = "0900000001",
                Address = "Quan 1, TP.HCM", // User.Address giới hạn [StringLength(20)]
                Avatar = "/images/Users/customer.jpg",
                IsActive = true,
            };

            // Dữ liệu seed có 5 nhà hàng -> tạo 5 chủ nhà hàng tương ứng (owner1..owner5)
            var restaurantSeed = GetSeedRestaurants();
            var owners = new List<User>();
            foreach (var r in restaurantSeed)
            {
                owners.Add(new User
                {
                    FullName = $"Owner of {r.Name}",
                    Email = $"owner{r.Id}@gmail.com",
                    Password = demoPasswordHash,
                    Phone = r.Phone,
                    Avatar = $"/images/Users/owner{r.Id}.jpg",
                    IsActive = true,
                });
            }

            // 3 tài xế mẫu để test luồng nhận đơn / giao hàng
            var drivers = new List<User>
            {
                new User { FullName = "Luy Van Dong", Email = "driver1@gmail.com", Password = demoPasswordHash, Phone = "0900000101", Avatar = "/images/Users/driver1.jpg", IsActive = true },
                new User { FullName = "Le Van Xe", Email = "driver2@gmail.com", Password = demoPasswordHash, Phone = "0900000102", Avatar = "/images/Users/driver2.jpg", IsActive = true },
                new User { FullName = "Pham Van Giao", Email = "driver3@gmail.com", Password = demoPasswordHash, Phone = "0900000103", Avatar = "/images/Users/driver3.jpg", IsActive = true },
            };

            context.Users.AddRange(new[] { admin, customer }.Concat(owners).Concat(drivers));
            await context.SaveChangesAsync();

            // Gán role cho từng user
            context.UserRoles.Add(new UserRole { UserId = admin.Id, RoleId = roleAdmin.Id });
            context.UserRoles.Add(new UserRole { UserId = customer.Id, RoleId = roleCustomer.Id });
            foreach (var owner in owners)
            {
                context.UserRoles.Add(new UserRole { UserId = owner.Id, RoleId = roleOwner.Id });
            }
            foreach (var driver in drivers)
            {
                context.UserRoles.Add(new UserRole { UserId = driver.Id, RoleId = roleDriver.Id });
            }
            await context.SaveChangesAsync();

            // Hồ sơ tài xế (DriverProfile) — chưa có GPS/vị trí, chỉ dữ liệu cơ bản
            context.DriverProfiles.AddRange(
                new DriverProfile { UserId = drivers[0].Id, VehicleType = VehicleType.Motorbike, LicensePlate = "59-X1 123.45", IsAvailable = true, Rating = 4.9, TotalDeliveries = 120 },
                new DriverProfile { UserId = drivers[1].Id, VehicleType = VehicleType.Motorbike, LicensePlate = "59-X2 678.90", IsAvailable = true, Rating = 4.7, TotalDeliveries = 85 },
                new DriverProfile { UserId = drivers[2].Id, VehicleType = VehicleType.Car, LicensePlate = "51G-123.45", IsAvailable = false, Rating = 4.8, TotalDeliveries = 200 }
            );
            await context.SaveChangesAsync();

            // ============ 3. RESTAURANTS ============
            // map: id trong data seed (1..5) -> Restaurant entity thật vừa tạo (Id do DB tự sinh)
            var restaurantMap = new Dictionary<int, Restaurant>();

            for (int i = 0; i < restaurantSeed.Count; i++)
            {
                var s = restaurantSeed[i];

                var restaurant = new Restaurant
                {
                    Name = s.Name,
                    Description = s.Description,
                    Address = s.Address,
                    PhoneNumber = s.Phone,
                    Email = s.Email,

                    // Seed image
                    ImageUrl = $"/images/restaurants/restaurant{s.Id}.jpg",

                    OpenTime = TimeOnly.Parse(s.OpenTime),
                    CloseTime = TimeOnly.Parse(s.CloseTime),
                    DeliveryFee = s.DeliveryFee,
                    Rating = s.Rating,
                    TotalReviews = s.TotalReviews,
                    IsActive = s.IsActive,
                    OwnerId = owners[i].Id,
                };

                context.Restaurants.Add(restaurant);
                restaurantMap[s.Id] = restaurant;
            }

            await context.SaveChangesAsync();

            // ============ 4. SYSTEM CATEGORIES ============
            // Danh mục chuẩn hoá từ field "category"/"categoryId" không nhất quán trong data/foods.js
            var systemCategoryNames = GetSeedFoods().Select(f => f.CategoryName).Distinct().ToList();
            var systemCategories = new Dictionary<string, SystemCategory>();
            foreach (var name in systemCategoryNames)
            {
                var sc = new SystemCategory { Name = name, IsActive = true };
                context.SystemCategories.Add(sc);
                systemCategories[name] = sc;
            }
            await context.SaveChangesAsync();

            // ============ 5. CATEGORIES (liên kết Restaurant <-> SystemCategory) ============
            // Food.CategoryId trỏ vào Category (không trỏ thẳng vào SystemCategory),
            // nên mỗi cặp (nhà hàng, danh mục) cần 1 dòng Category riêng.
            var foodSeed = GetSeedFoods();
            var categoryMap = new Dictionary<(int restaurantMockId, string categoryName), Category>();

            foreach (var f in foodSeed)
            {
                var key = (f.RestaurantId, f.CategoryName);
                if (!categoryMap.ContainsKey(key))
                {
                    var category = new Category
                    {
                        RestaurantId = restaurantMap[f.RestaurantId].Id,
                        SystemCategoryId = systemCategories[f.CategoryName].Id,
                        IsActive = true,
                    };
                    context.Categories.Add(category);
                    categoryMap[key] = category;
                }
            }
            await context.SaveChangesAsync();

            // ============ 6. FOODS ============
            foreach (var f in foodSeed)
            {
                var category = categoryMap[(f.RestaurantId, f.CategoryName)];
                context.Foods.Add(new Food
                {
                    Name = f.Name,
                    Description = f.Description,
                    Price = f.Price,
                    Image = $"/images/foods/{ToImageName(f.Name)}.jpg",
                    Status = FoodStatus.Available,
                    CategoryId = category.Id,
                    RestaurantId = restaurantMap[f.RestaurantId].Id,
                });
            }
            await context.SaveChangesAsync();

            var now = DateTime.UtcNow;
            var firstRestaurant = restaurantMap.Values.First();

            var notifications = new List<Notification>
            {
                // Customer
                new Notification
                {
                    UserId = customer.Id,
                    Title = "Order placed successfully",
                    Message = $"Your order at {firstRestaurant.Name} has been placed and is pending restaurant confirmation.",
                    Type = NotificationType.OrderCreated,
                    RelatedEntityId = firstRestaurant.Id,
                    IsRead = false,
                    CreatedAt = now.AddMinutes(-30)
                },
                new Notification
                {
                    UserId = customer.Id,
                    Title = "Order being prepared",
                    Message = $"{firstRestaurant.Name} is preparing your order.",
                    Type = NotificationType.OrderStatusChanged,
                    RelatedEntityId = firstRestaurant.Id,
                    IsRead = false,
                    CreatedAt = now.AddMinutes(-20)
                },
                new Notification
                {
                    UserId = customer.Id,
                    Title = "Payment completed successfully",
                    Message = "We have received your payment for the most recent order.",
                    Type = NotificationType.PaymentCompleted,
                    RelatedEntityId = null,
                    IsRead = true,
                    CreatedAt = now.AddHours(-5)
                },
                new Notification
                {
                    UserId = customer.Id,
                    Title = "Welcome to the app!",
                    Message = "Discover hundreds of delicious dishes from your favorite restaurants nearby.",
                    Type = NotificationType.System,
                    RelatedEntityId = null,
                    IsRead = true,
                    CreatedAt = now.AddDays(-2)
                },

                // Owner (chủ nhà hàng đầu tiên)
                new Notification
                {
                    UserId = owners[0].Id,
                    Title = "New order received",
                    Message = $"{firstRestaurant.Name} has received a new order, please confirm.",
                    Type = NotificationType.OrderCreated,
                    RelatedEntityId = firstRestaurant.Id,
                    IsRead = false,
                    CreatedAt = now.AddMinutes(-30)
                },
                new Notification
                {
                    UserId = owners[0].Id,
                    Title = "New review from customer",
                    Message = $"A customer has just left a 5-star review for the dish at {firstRestaurant.Name}.",
                    Type = NotificationType.NewReview,
                    RelatedEntityId = firstRestaurant.Id,
                    IsRead = false,
                    CreatedAt = now.AddHours(-3)
                },

                // Driver (tài xế đầu tiên)
                new Notification
                {
                    UserId = drivers[0].Id,
                    Title = "New delivery order available",
                    Message = $"A delivery order at {firstRestaurant.Name} is ready, please accept to start the delivery.",
                    Type = NotificationType.OrderStatusChanged,
                    RelatedEntityId = firstRestaurant.Id,
                    IsRead = false,
                    CreatedAt = now.AddMinutes(-15)
                },
                new Notification
                {
                    UserId = drivers[0].Id,
                    Title = "Welcome, new delivery driver!",
                    Message = "Turn your availability on to start receiving delivery requests.",
                    Type = NotificationType.System,
                    RelatedEntityId = null,
                    IsRead = true,
                    CreatedAt = now.AddDays(-1)
                },

                // Admin
                new Notification
                {
                    UserId = admin.Id,
                    Title = "System operating normally",
                    Message = "No issues reported in the last 24 hours.",
                    Type = NotificationType.System,
                    RelatedEntityId = null,
                    IsRead = false,
                    CreatedAt = now.AddHours(-1)
                },
            };

            context.Notifications.AddRange(notifications);
            await context.SaveChangesAsync();
        }

        private static List<SeedRestaurant> GetSeedRestaurants() => new()
        {
            new SeedRestaurant { Id = 1, Name = "The Rustic Bun", Description = "Handcrafted burgers made with premium beef, artisan buns and homemade sauces.", Address = "123 Central Street, New York", Phone = "+1 123 456 789", Email = "hello@therusticbun.com", OpenTime = "09:00 AM", CloseTime = "10:00 PM", DeliveryFee = 1.99m, Rating = 4.8, TotalReviews = 268, IsActive = true },
            new SeedRestaurant { Id = 2, Name = "Clubhouse Central", Description = "A cozy neighborhood restaurant serving gourmet burgers, handcrafted sandwiches and freshly brewed coffee all day.", Address = "58 Broadway Avenue, New York", Phone = "+1 212 555 2801", Email = "contact@clubhousecentral.com", OpenTime = "08:00 AM", CloseTime = "09:30 PM", DeliveryFee = 0.99m, Rating = 4.5, TotalReviews = 194, IsActive = true },
            new SeedRestaurant { Id = 3, Name = "Tokyo Sushi", Description = "Authentic Japanese cuisine prepared daily with premium seafood, handcrafted sushi and traditional ramen.", Address = "88 Sakura Avenue, Tokyo District", Phone = "+81 90 1234 5678", Email = "hello@tokyosushi.com", OpenTime = "11:00 AM", CloseTime = "10:30 PM", DeliveryFee = 2.99m, Rating = 4.9, TotalReviews = 325, IsActive = true },
            new SeedRestaurant { Id = 4, Name = "Roma Pasta", Description = "Traditional Italian recipes featuring handmade pasta, wood-fired pizzas and authentic Mediterranean flavors.", Address = "25 Roma Street, Little Italy", Phone = "+39 555 123 456", Email = "hello@romapasta.com", OpenTime = "10:30 AM", CloseTime = "10:00 PM", DeliveryFee = 1.99m, Rating = 4.7, TotalReviews = 287, IsActive = true },
            new SeedRestaurant { Id = 5, Name = "Bombay Spice", Description = "Traditional Indian cuisine featuring authentic curries, tandoori specialties, fragrant biryanis and freshly baked naan.", Address = "58 Spice Avenue, Little India", Phone = "+1 212 555 8877", Email = "hello@bombayspice.com", OpenTime = "10:30 AM", CloseTime = "10:30 PM", DeliveryFee = 1.49m, Rating = 4.6, TotalReviews = 182, IsActive = true },
        };

        private static string ToImageName(string name)
        {
            return name.ToLowerInvariant().Replace(" ", "-");
        }

        private static List<SeedFood> GetSeedFoods() => new()
        {
            new SeedFood { RestaurantId = 1, CategoryName = "Mains", Name = "Classic Burger", Description = "Premium beef, cheddar cheese, lettuce, tomato and signature sauce.", Price = 14.5m },
            new SeedFood { RestaurantId = 1, CategoryName = "Burger", Name = "Double Cheese Burger", Description = "Double beef patties with cheddar cheese and caramelized onions.", Price = 18.0m },
            new SeedFood { RestaurantId = 1, CategoryName = "Burger", Name = "Chicken Burger", Description = "Grilled chicken breast with honey mustard sauce.", Price = 13.0m },
            new SeedFood { RestaurantId = 1, CategoryName = "Sides", Name = "French Fries", Description = "Golden crispy fries served with ketchup.", Price = 5.0m },
            new SeedFood { RestaurantId = 1, CategoryName = "Sides", Name = "Onion Rings", Description = "Beer battered crispy onion rings.", Price = 6.0m },
            new SeedFood { RestaurantId = 2, CategoryName = "Appetizers", Name = "Garlic Bread", Description = "Freshly baked garlic bread with butter and herbs.", Price = 5.5m },
            new SeedFood { RestaurantId = 2, CategoryName = "Appetizers", Name = "Chicken Wings", Description = "Crispy chicken wings served with BBQ sauce.", Price = 8.0m },
            new SeedFood { RestaurantId = 2, CategoryName = "Mains", Name = "Club Sandwich", Description = "Triple-layer sandwich with grilled chicken, bacon and cheese.", Price = 13.0m },
            new SeedFood { RestaurantId = 2, CategoryName = "Mains", Name = "Beef Burger Deluxe", Description = "Juicy beef burger topped with cheddar and caramelized onions.", Price = 16.0m },
            new SeedFood { RestaurantId = 2, CategoryName = "Sides", Name = "Curly Fries", Description = "Seasoned crispy curly fries.", Price = 5.0m },
            new SeedFood { RestaurantId = 3, CategoryName = "Appetizers", Name = "Tempura Shrimp", Description = "Crispy shrimp tempura served with traditional dipping sauce.", Price = 10.5m },
            new SeedFood { RestaurantId = 3, CategoryName = "Appetizers", Name = "Gyoza", Description = "Pan-fried pork dumplings with soy dipping sauce.", Price = 8.0m },
            new SeedFood { RestaurantId = 3, CategoryName = "Mains", Name = "Salmon Sushi Set", Description = "Fresh salmon nigiri and sushi rolls prepared by our chef.", Price = 19.5m },
            new SeedFood { RestaurantId = 3, CategoryName = "Mains", Name = "Tuna Sashimi", Description = "Premium sliced bluefin tuna served with wasabi.", Price = 22.0m },
            new SeedFood { RestaurantId = 3, CategoryName = "Mains", Name = "Tonkotsu Ramen", Description = "Slow-cooked pork broth with chashu, egg and noodles.", Price = 16.0m },
            new SeedFood { RestaurantId = 4, CategoryName = "Appetizers", Name = "Bruschetta", Description = "Toasted artisan bread topped with tomatoes, basil and olive oil.", Price = 8.0m },
            new SeedFood { RestaurantId = 4, CategoryName = "Appetizers", Name = "Caesar Salad", Description = "Fresh romaine lettuce with parmesan cheese and Caesar dressing.", Price = 9.0m },
            new SeedFood { RestaurantId = 4, CategoryName = "Mains", Name = "Margherita Pizza", Description = "Wood-fired pizza with mozzarella, basil and tomato sauce.", Price = 16.0m },
            new SeedFood { RestaurantId = 4, CategoryName = "Mains", Name = "Pepperoni Pizza", Description = "Classic Italian pizza loaded with spicy pepperoni.", Price = 18.0m },
            new SeedFood { RestaurantId = 4, CategoryName = "Mains", Name = "Spaghetti Carbonara", Description = "Creamy carbonara with pancetta and parmesan cheese.", Price = 17.0m },
            new SeedFood { RestaurantId = 5, CategoryName = "Appetizers", Name = "Vegetable Samosa", Description = "Crispy pastry filled with spiced potatoes and peas.", Price = 6.5m },
            new SeedFood { RestaurantId = 5, CategoryName = "Appetizers", Name = "Chicken Tikka", Description = "Marinated chicken grilled in a traditional tandoor oven.", Price = 10.0m },
            new SeedFood { RestaurantId = 5, CategoryName = "Mains", Name = "Butter Chicken", Description = "Creamy tomato curry served with fragrant basmati rice.", Price = 17.5m },
            new SeedFood { RestaurantId = 5, CategoryName = "Mains", Name = "Lamb Rogan Josh", Description = "Tender lamb slow-cooked with Kashmiri spices.", Price = 19.0m },
            new SeedFood { RestaurantId = 5, CategoryName = "Mains", Name = "Chicken Biryani", Description = "Classic basmati rice cooked with aromatic spices and chicken.", Price = 16.5m },
        };
    }
}