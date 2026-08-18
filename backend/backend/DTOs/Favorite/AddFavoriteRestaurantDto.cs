using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Favorite
{
    public class AddFavoriteRestaurantDto
    {
        [Required]
        public int RestaurantId { get; set; }
    }
}
