using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetLifecycleEventDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public short EventTypeId { get; set; }
    public DateTime EventDate { get; set; }
    public Guid? PerformedBy { get; set; }
    public string? Notes { get; set; }
    public string? Details { get; set; }
}

public class CreateAssetLifecycleEventDto
{
    [Required]
    public Guid AssetId { get; set; }
    public short EventTypeId { get; set; }
    public DateTime EventDate { get; set; }
    public Guid? PerformedBy { get; set; }
    public string? Notes { get; set; }
    public string? Details { get; set; }
}

public class UpdateAssetLifecycleEventDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public short EventTypeId { get; set; }
    public DateTime EventDate { get; set; }
    public Guid? PerformedBy { get; set; }
    public string? Notes { get; set; }
    public string? Details { get; set; }
}
