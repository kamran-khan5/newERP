using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetAcquisitionDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public DateTime AcquisitionDate { get; set; }
    public decimal AcquisitionCost { get; set; }
    public string CurrencyCode { get; set; } = default!;
    public Guid? SupplierId { get; set; }
    public string? PurchaseReference { get; set; }
    public ERP.Domain.Enums.Asset.AcquisitionType AcquisitionType { get; set; }
    public DateTime? WarrantyExpiryDate { get; set; }
}
