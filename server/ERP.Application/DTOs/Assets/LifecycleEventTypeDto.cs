namespace ERP.Application.DTOs.Assets;

public class LifecycleEventTypeDto
{
    public short Id { get; set; }
    public string? Stage { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
