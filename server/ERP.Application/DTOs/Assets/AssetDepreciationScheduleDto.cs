using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetDepreciationScheduleDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public short MethodId { get; set; }
    public int UsefulLifeMonths { get; set; }
    public decimal SalvageValue { get; set; }
    public DateTime StartDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateAssetDepreciationScheduleDto
{
    [Required]
    public Guid AssetId { get; set; }
    public short MethodId { get; set; }
    public int UsefulLifeMonths { get; set; }
    public decimal SalvageValue { get; set; }
    public DateTime StartDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateAssetDepreciationScheduleDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public short MethodId { get; set; }
    public int UsefulLifeMonths { get; set; }
    public decimal SalvageValue { get; set; }
    public DateTime StartDate { get; set; }
    public bool IsActive { get; set; } = true;
}
