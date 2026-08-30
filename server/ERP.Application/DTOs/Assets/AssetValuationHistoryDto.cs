using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetValuationHistoryDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public DateTime ValuationDate { get; set; }
    public decimal Value { get; set; }
    public string CurrencyCode { get; set; } = default!;
    public string? ValuationMethod { get; set; }
    public Guid? ValuedBy { get; set; }
    public string? Notes { get; set; }
}

public class CreateAssetValuationHistoryDto
{
    [Required]
    public Guid AssetId { get; set; }
    public DateTime ValuationDate { get; set; }
    public decimal Value { get; set; }
    public string CurrencyCode { get; set; } = default!;
    public string? ValuationMethod { get; set; }
    public Guid? ValuedBy { get; set; }
    public string? Notes { get; set; }
}

public class UpdateAssetValuationHistoryDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public DateTime ValuationDate { get; set; }
    public decimal Value { get; set; }
    public string CurrencyCode { get; set; } = default!;
    public string? ValuationMethod { get; set; }
    public Guid? ValuedBy { get; set; }
    public string? Notes { get; set; }
}
