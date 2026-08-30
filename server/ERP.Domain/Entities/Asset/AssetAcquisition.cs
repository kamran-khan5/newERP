using System;
using ERP.Domain.Common;
using ERP.Domain.Enums.Asset;

namespace ERP.Domain.Entities.Asset;

public class AssetAcquisition : BaseEntity<long>, IAuditableEntity
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public DateTime AcquisitionDate { get; set; }
    public decimal AcquisitionCost { get; set; }
    
    public string CurrencyCode { get; set; } = default!;
    public Currency Currency { get; set; } = default!;
    
    public Guid? SupplierId { get; set; }
    public string? PurchaseReference { get; set; }
    
    public AcquisitionType AcquisitionType { get; set; }
    public DateTime? WarrantyExpiryDate { get; set; }
    
    public Guid? CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
