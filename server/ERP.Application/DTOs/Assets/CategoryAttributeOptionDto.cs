using System;

namespace ERP.Application.DTOs.Assets;

public class CategoryAttributeOptionDto
{
    public long Id { get; set; }
    public long AttributeId { get; set; }
    public string Value { get; set; } = default!;
    public string Label { get; set; } = default!;
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}
