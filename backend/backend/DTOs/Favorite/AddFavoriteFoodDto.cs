using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Favorite
{
    public class AddFavoriteFoodDto
    {
        [Required]
        public int FoodId { get; set; }
    }
}
