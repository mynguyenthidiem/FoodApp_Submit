using backend.Models;

namespace backend.DTOs.Driver
{
    public class DriverProfileDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Avatar { get; set; }

        public VehicleType VehicleType { get; set; }
        public string? LicensePlate { get; set; }
        public bool IsAvailable { get; set; }
        public double Rating { get; set; }
        public int TotalDeliveries { get; set; }
    }
}
