using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class DepreciationMethod : BaseEntity<short>
{
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}
