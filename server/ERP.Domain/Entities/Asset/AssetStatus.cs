using System;
using System.Collections.Generic;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetStatus : BaseEntity<short>, IAuditableEntity
{
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
