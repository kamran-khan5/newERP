namespace ERP.Application.DTOs.Assets;

public class LocationDto
{
    public long Id { get; set; }
    public long? ParentLocationId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? LocationType { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; }
}
