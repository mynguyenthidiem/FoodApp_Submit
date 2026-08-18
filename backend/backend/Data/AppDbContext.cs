using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SystemCategory> SystemCategories { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<FavoriteFood> FavoriteFoods { get; set; }
        public DbSet<FavoriteRestaurant> FavoriteRestaurants { get; set; }
        public DbSet<DriverProfile> DriverProfiles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Name)
                .IsUnique();

            modelBuilder.Entity<UserRole>()
                .HasIndex(ur => new { ur.UserId, ur.RoleId })
                .IsUnique();

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cart>()
                .HasIndex(c => new { c.UserId, c.FoodId })
                .IsUnique();

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Food)
                .WithMany(f => f.Carts)
                .HasForeignKey(c => c.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Restaurant)
                .WithMany(r => r.Orders)
                .HasForeignKey(o => o.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Order>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .Property(o => o.PaymentMethod)
                .HasConversion<string>();

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderDetail>()
                .HasOne(od => od.Food)
                .WithMany(f => f.OrderDetails)
                .HasForeignKey(od => od.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasIndex(p => p.OrderId)
                .IsUnique();

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Payment>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Review>()
                .HasIndex(r => new { r.UserId, r.FoodId })
                .IsUnique();

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Food)
                .WithMany(f => f.Reviews)
                .HasForeignKey(r => r.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Food>()
                .HasOne(f => f.Category)
                .WithMany(c => c.Foods)
                .HasForeignKey(f => f.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Food>()
                .HasOne(f => f.Restaurant)
                .WithMany(r => r.Foods)
                .HasForeignKey(f => f.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Food>()
                .Property(o => o.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Category>()
                .HasOne(c => c.Restaurant)
                .WithMany(r => r.Categories)
                .HasForeignKey(c => c.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.SystemCategory)
                .WithMany(sc => sc.Categories)
                .HasForeignKey(c => c.SystemCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Category>()
                .HasIndex(c => new { c.RestaurantId, c.SystemCategoryId })
                .IsUnique();

            modelBuilder.Entity<SystemCategory>()
                .HasIndex(sc => sc.Name)
                .IsUnique();

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Restaurant)
                .WithMany(r => r.Carts)
                .HasForeignKey(c => c.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Restaurant>()
                .HasOne(r => r.Owner)
                .WithMany(u => u.Restaurants)
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
                
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Notification>()
             .HasIndex(n => new { n.UserId, n.CreatedAt });

            modelBuilder.Entity<FavoriteFood>()
               .HasIndex(ff => new { ff.UserId, ff.FoodId })
               .IsUnique();

            modelBuilder.Entity<FavoriteFood>()
                .HasOne(ff => ff.User)
                .WithMany()
                .HasForeignKey(ff => ff.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FavoriteFood>()
                .HasOne(ff => ff.Food)
                .WithMany()
                .HasForeignKey(ff => ff.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FavoriteRestaurant>()
                .HasIndex(fr => new { fr.UserId, fr.RestaurantId })
                .IsUnique();

            modelBuilder.Entity<FavoriteRestaurant>()
                .HasOne(fr => fr.User)
                .WithMany()
                .HasForeignKey(fr => fr.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FavoriteRestaurant>()
                .HasOne(fr => fr.Restaurant)
                .WithMany()
                .HasForeignKey(fr => fr.RestaurantId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<DriverProfile>()
               .HasOne(dp => dp.User)
               .WithOne(u => u.DriverProfile)
               .HasForeignKey<DriverProfile>(dp => dp.UserId)
               .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DriverProfile>()
                .Property(dp => dp.VehicleType)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Driver)
                .WithMany()
                .HasForeignKey(o => o.DriverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}