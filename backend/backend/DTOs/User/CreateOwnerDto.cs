using System.ComponentModel.DataAnnotations;

public class CreateOwnerDto
{
    [Required]
    public string FullName { get; set; } = string.Empty;
    [EmailAddress, Required]
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
    [Phone]
    public string? Phone { get; set; }

    public string? Address { get; set; }
}