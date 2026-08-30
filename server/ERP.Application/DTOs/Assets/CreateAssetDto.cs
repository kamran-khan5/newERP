using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class CreateAssetDto
{
    [Required, StringLength(50)]
    public string AssetCode { get; set; } = default!;
    [Required, StringLength(100)]
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public ERP.Domain.Enums.Asset.OwnershipType Ownership { get; set; }
    [Required]
    public short AssetClassId { get; set; }
    [Required]
    public long CategoryId { get; set; }
    [Required]
    public short StatusId { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? CustodianId { get; set; }
    public long? CurrentLocationId { get; set; }
    public string? ExtraAttributes { get; set; }
    public bool IsActive { get; set; } = true;
}
