using System.Collections.Generic;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetCategory : BaseEntity<long>
{
    public short AssetClassId { get; set; }
    public AssetClass AssetClass { get; set; } = default!;
    
    public long? ParentCategoryId { get; set; }
    public AssetCategory? ParentCategory { get; set; }
    
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    
    public string? Path { get; set; }
    public int? Depth { get; set; }
    public int? DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    
    public ICollection<AssetCategory> SubCategories { get; set; } = new List<AssetCategory>();
    public ICollection<CategoryAttribute> Attributes { get; set; } = new List<CategoryAttribute>();
    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
