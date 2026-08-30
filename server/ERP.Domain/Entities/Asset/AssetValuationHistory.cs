using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetValuationHistory : BaseEntity<long>
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public DateTime ValuationDate { get; set; }
    public decimal Value { get; set; }
    
    public string CurrencyCode { get; set; } = default!;
    public Currency Currency { get; set; } = default!;
    
    public string? ValuationMethod { get; set; }
    public Guid? ValuedBy { get; set; }
    public string? Notes { get; set; }
    
    public Guid? CreatedBy { get; set; }
}
