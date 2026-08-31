using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateCategoryAttributeOptionDto
{
    [Required]
    public long AttributeId { get; set; }

    [Required, StringLength(150)]
    public string Value { get; set; } = default!;

    [Required, StringLength(150)]
    public string Label { get; set; } = default!;

    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}
