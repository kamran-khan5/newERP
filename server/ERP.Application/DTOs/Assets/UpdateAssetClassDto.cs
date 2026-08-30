using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class UpdateAssetClassDto
{
    [Required]
    [StringLength(50)]
    public string Code { get; set; } = default!;

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = default!;

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsActive { get; set; }

}
