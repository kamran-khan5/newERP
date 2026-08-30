using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateAssetCategoryDto
{
    [Required]
    public short AssetClassId { get; set; }
    public long? ParentCategoryId { get; set; }
    [Required, StringLength(50)]
    public string Code { get; set; } = default!;
    [Required, StringLength(100)]
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
