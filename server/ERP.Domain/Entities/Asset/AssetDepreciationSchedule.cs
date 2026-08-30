using System;
using System.Collections.Generic;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetDepreciationSchedule : BaseEntity<long>, IAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public short MethodId { get; set; }
    public DepreciationMethod Method { get; set; } = default!;
    
    public int UsefulLifeMonths { get; set; }
    public decimal SalvageValue { get; set; }
    public DateTime StartDate { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    public ICollection<AssetDepreciationEntry> Entries { get; set; } = new List<AssetDepreciationEntry>();
}
