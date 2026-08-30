using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetCategoryDto
{
    public long Id { get; set; }
    public short AssetClassId { get; set; }
    public long? ParentCategoryId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? Path { get; set; }
    public int? Depth { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
