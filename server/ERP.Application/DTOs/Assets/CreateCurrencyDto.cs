using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateCurrencyDto
{
    [Required]
    [StringLength(3)]
    public string Code { get; set; } = default!;
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = default!;

    [StringLength(10)]
    public string? Symbol { get; set; }

}
