using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Driver
{
    public class UpdateDriverAvailabilityDto
    {
        [Required]
        public bool IsAvailable { get; set; }
    }
}
