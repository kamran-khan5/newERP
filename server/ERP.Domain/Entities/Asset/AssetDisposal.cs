using System;
using ERP.Domain.Common;

namespace ERP.Domain.Entities.Asset;

public class AssetDisposal : BaseEntity<long>
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = default!;
    
    public DateTime DisposalDate { get; set; }
    public string DisposalMethod { get; set; } = default!;
    public decimal? DisposalValue { get; set; }
    
    public string? CurrencyCode { get; set; }
    public Currency? Currency { get; set; }
    
    public string? BuyerInfo { get; set; }
    public string? Reason { get; set; }
    
    public Guid? ApprovedBy { get; set; }
    
    public Guid? CreatedBy { get; set; }
}
