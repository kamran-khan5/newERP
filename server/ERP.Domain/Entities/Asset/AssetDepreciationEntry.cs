using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetDepreciationEntry : BaseEntity<long>
{
    public long ScheduleId { get; set; }
    public AssetDepreciationSchedule Schedule { get; set; } = default!;
    
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    
    public decimal? OpeningBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? BookValueAfter { get; set; }
    
    public bool Posted { get; set; }
    public DateTime? PostedAt { get; set; }
    public Guid? PostedBy { get; set; }
}
