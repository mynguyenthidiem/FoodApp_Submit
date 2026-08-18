using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Driver
{
    public class CreateDriverDto
    {
        [Required, StringLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
        [Phone]
        public string? Phone { get; set; }

        public string? Address { get; set; }

        public VehicleType VehicleType { get; set; } = VehicleType.Motorbike;

        [StringLength(20)]
        public string? LicensePlate { get; set; }
    }
}
