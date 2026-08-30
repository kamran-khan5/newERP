using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetLifecycleEvent : BaseEntity<long>
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public short EventTypeId { get; set; }
    public LifecycleEventType EventType { get; set; } = default!;
    
    public DateTime EventDate { get; set; }
    
    public Guid? PerformedBy { get; set; }
    public string? Notes { get; set; }
    public string? Details { get; set; }
    
    public Guid? CreatedBy { get; set; }
}
