using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetDto
{
    public Guid Id { get; set; }
    public string AssetCode { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public ERP.Domain.Enums.Asset.OwnershipType Ownership { get; set; }
    public short AssetClassId { get; set; }
    public string? AssetClassName { get; set; }
    public long CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public short StatusId { get; set; }
    public string? StatusName { get; set; }
    public Guid? DepartmentId { get; set; }
    public Guid? CustodianId { get; set; }
    public long? CurrentLocationId { get; set; }
    public string? CurrentLocationName { get; set; }
    public string? ExtraAttributes { get; set; }
    public bool IsActive { get; set; }
}
