using System;
using System.Collections.Generic;
using ERP.Domain.Common;
using ERP.Domain.Enums.Asset;

namespace ERP.Domain.Entities.Asset;

public class Asset : BaseEntity, IAuditableEntity
{
    public string AssetCode { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    
    public OwnershipType Ownership { get; set; }
    
    public short AssetClassId { get; set; }
    public AssetClass AssetClass { get; set; } = default!;
    
    public long CategoryId { get; set; }
    public AssetCategory Category { get; set; } = default!;
    
    public short StatusId { get; set; }
    public AssetStatus Status { get; set; } = default!;
    
    public Guid? DepartmentId { get; set; }
    public Guid? CustodianId { get; set; }
    
    public long? CurrentLocationId { get; set; }
    public Location? CurrentLocation { get; set; }
    
    public string? ExtraAttributes { get; set; }
    
    public bool IsActive { get; set; } = true;
    public long? RowVersion { get; set; }
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
    
    public AssetAcquisition? Acquisition { get; set; }
    public ICollection<AssetAttachment> Attachments { get; set; } = new List<AssetAttachment>();
}
