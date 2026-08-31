using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class CategoryAttributeOption : BaseEntity<long>, IAuditableEntity
{
    public long AttributeId { get; set; }
    public CategoryAttribute Attribute { get; set; } = default!;

    public string Value { get; set; } = default!;
    public string Label { get; set; } = default!;

    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
