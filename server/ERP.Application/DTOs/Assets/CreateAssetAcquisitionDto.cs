using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateAssetAcquisitionDto
{
    [Required]
    public Guid AssetId { get; set; }
    [Required]
    public DateTime AcquisitionDate { get; set; }
    [Required]
    public decimal AcquisitionCost { get; set; }
    [Required, StringLength(3)]
    public string CurrencyCode { get; set; } = default!;
    public Guid? SupplierId { get; set; }
    public string? PurchaseReference { get; set; }
    public ERP.Domain.Enums.Asset.AcquisitionType AcquisitionType { get; set; }
    public DateTime? WarrantyExpiryDate { get; set; }
}
