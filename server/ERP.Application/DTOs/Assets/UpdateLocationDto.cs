using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class UpdateLocationDto
{
    public long? ParentLocationId { get; set; }

    [Required]
    [StringLength(50)]
    public string Code { get; set; } = default!;

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = default!;

    [StringLength(100)]
    public string? LocationType { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    public bool IsActive { get; set; }

}
