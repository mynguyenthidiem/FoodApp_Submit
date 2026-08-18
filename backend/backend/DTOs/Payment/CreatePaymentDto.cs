using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Payment
{
    public class CreatePaymentDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public PaymentMethod Method { get; set; }
    }
}