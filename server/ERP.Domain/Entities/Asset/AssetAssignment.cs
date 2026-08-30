using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetAssignment : BaseEntity<long>
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public Guid? FromDepartmentId { get; set; }
    public Guid? ToDepartmentId { get; set; }
    
    public Guid? FromCustodianId { get; set; }
    public Guid? ToCustodianId { get; set; }
    
    public long? FromLocationId { get; set; }
    public Location? FromLocation { get; set; }
    
    public long? ToLocationId { get; set; }
    public Location? ToLocation { get; set; }
    
    public DateTime AssignmentDate { get; set; }
    public string? Reason { get; set; }
    
    public Guid? ApprovedBy { get; set; }
    
    public Guid? CreatedBy { get; set; }
}
