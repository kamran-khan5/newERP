using System;
using ERP.Domain.Common;
using ERP.Domain.Enums.Asset;

namespace ERP.Domain.Entities.Asset;

public class CategoryAttribute : BaseEntity<long>, IAuditableEntity
{
    public long CategoryId { get; set; }
    public AssetCategory Category { get; set; } = default!;
    
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    
    public AttributeDataType DataType { get; set; }
    
    public bool IsRequired { get; set; }
    public bool IsSearchable { get; set; }
    public bool IsFilterable { get; set; }
    
    public int? DisplayOrder { get; set; }
    public string? Description { get; set; }
    
    public string? DefaultValue { get; set; }
    public string? ValidationRules { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
