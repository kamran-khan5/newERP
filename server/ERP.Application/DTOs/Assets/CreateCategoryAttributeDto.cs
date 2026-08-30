using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateCategoryAttributeDto
{
    [Required]
    public long CategoryId { get; set; }
    [Required, StringLength(50)]
    public string Code { get; set; } = default!;
    [Required, StringLength(100)]
    public string Name { get; set; } = default!;
    public ERP.Domain.Enums.Asset.AttributeDataType DataType { get; set; }
    public bool IsRequired { get; set; }
    public bool IsSearchable { get; set; }
    public bool IsFilterable { get; set; }
    public int? DisplayOrder { get; set; }
    public string? Description { get; set; }
    public string? DefaultValue { get; set; }
    public string? ValidationRules { get; set; }
    public bool IsActive { get; set; } = true;
}
