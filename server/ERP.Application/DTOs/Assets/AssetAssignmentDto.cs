using System;
using System.ComponentModel.DataAnnotations;

namespace ERP.Application.DTOs.Assets;

public class AssetAssignmentDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public Guid? FromDepartmentId { get; set; }
    public Guid? ToDepartmentId { get; set; }
    public Guid? FromCustodianId { get; set; }
    public Guid? ToCustodianId { get; set; }
    public long? FromLocationId { get; set; }
    public long? ToLocationId { get; set; }
    public DateTime AssignmentDate { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}

public class CreateAssetAssignmentDto
{
    [Required]
    public Guid AssetId { get; set; }
    public Guid? FromDepartmentId { get; set; }
    public Guid? ToDepartmentId { get; set; }
    public Guid? FromCustodianId { get; set; }
    public Guid? ToCustodianId { get; set; }
    public long? FromLocationId { get; set; }
    public long? ToLocationId { get; set; }
    public DateTime AssignmentDate { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}

public class UpdateAssetAssignmentDto
{
    public long Id { get; set; }
    [Required]
    public Guid AssetId { get; set; }
    public Guid? FromDepartmentId { get; set; }
    public Guid? ToDepartmentId { get; set; }
    public Guid? FromCustodianId { get; set; }
    public Guid? ToCustodianId { get; set; }
    public long? FromLocationId { get; set; }
    public long? ToLocationId { get; set; }
    public DateTime AssignmentDate { get; set; }
    public string? Reason { get; set; }
    public Guid? ApprovedBy { get; set; }
}
