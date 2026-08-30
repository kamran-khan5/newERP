using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class LifecycleEventType : BaseEntity<short>
{
    public string? Stage { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
