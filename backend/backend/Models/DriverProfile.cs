using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public enum VehicleType
    {
        Motorbike,
        Car
    }
    public class DriverProfile
    {
        [Key, ForeignKey(nameof(User))]
        public int UserId { get; set; }

        public virtual User User { get; set; } = null!;

        public VehicleType VehicleType { get; set; } = VehicleType.Motorbike;

        [StringLength(20)]
        public string? LicensePlate { get; set; }

        public bool IsAvailable { get; set; } = false;

        public double Rating { get; set; } = 5.0;

        public int TotalDeliveries { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
