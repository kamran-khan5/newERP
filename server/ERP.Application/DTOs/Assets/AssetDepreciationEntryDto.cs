using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetDepreciationEntryDto
{
    public long Id { get; set; }
    [Required]
    public long ScheduleId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal? OpeningBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? BookValueAfter { get; set; }
    public bool Posted { get; set; }
    public DateTime? PostedAt { get; set; }
    public Guid? PostedBy { get; set; }
}

public class CreateAssetDepreciationEntryDto
{
    [Required]
    public long ScheduleId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal? OpeningBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? BookValueAfter { get; set; }
    public bool Posted { get; set; }
    public DateTime? PostedAt { get; set; }
    public Guid? PostedBy { get; set; }
}

public class UpdateAssetDepreciationEntryDto
{
    public long Id { get; set; }
    [Required]
    public long ScheduleId { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public decimal? OpeningBookValue { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? BookValueAfter { get; set; }
    public bool Posted { get; set; }
    public DateTime? PostedAt { get; set; }
    public Guid? PostedBy { get; set; }
}
