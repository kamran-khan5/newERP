using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetDisposalDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public DateTime DisposalDate { get; set; }
    [Required]
    public string DisposalMethod { get; set; } = default!;
    public decimal? DisposalValue { get; set; }
    public string? CurrencyCode { get; set; }
    public string? BuyerInfo { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}

public class CreateAssetDisposalDto
{
    [Required]
    public Guid AssetId { get; set; }
    public DateTime DisposalDate { get; set; }
    [Required]
    public string DisposalMethod { get; set; } = default!;
    public decimal? DisposalValue { get; set; }
    public string? CurrencyCode { get; set; }
    public string? BuyerInfo { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}

public class UpdateAssetDisposalDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public DateTime DisposalDate { get; set; }
    [Required]
    public string DisposalMethod { get; set; } = default!;
    public decimal? DisposalValue { get; set; }
    public string? CurrencyCode { get; set; }
    public string? BuyerInfo { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}
